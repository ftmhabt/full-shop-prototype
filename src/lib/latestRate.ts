"use server";
import { Prisma } from "@prisma/client";
import axios from "axios";
import { existsSync } from "fs";
import fs from "fs/promises";
import path from "path";
import db from "./db";

// const CACHE_FILE = path.resolve("./rateCache.json");
const CACHE_FILE = path.join(process.cwd(), "rateCache.json");

const DEFAULT_MAX_AGE_MIN = 60 * 3; // 3 hours

// Ensure cache file exists
async function ensureCacheFile() {
  const dir = path.dirname(CACHE_FILE);
  if (!existsSync(dir)) {
    await fs.mkdir(dir, { recursive: true });
  }
  if (!existsSync(CACHE_FILE)) {
    await fs.writeFile(CACHE_FILE, JSON.stringify({ rate: 0, fetchedAt: 0 }));
  }
}

// --- Fetch from Navasan API ---
async function fetchFromNavasan(): Promise<number> {
  const key = process.env.EXCHANGE_API_ACCESS_KEY;
  if (!key) throw new Error("Invalid API key");

  const res = await axios.get("https://api.navasan.tech/latest", {
    params: { api_key: key, item: "usd" },
    timeout: 5000,
  });
  console.log("navasan", res.data);
  const tomanRate = res.data?.usd?.value;

  const tomanRateNumber = Number(tomanRate);
  if (tomanRateNumber <= 0) {
    throw new Error("Unexpected API response format");
  }

  return tomanRate;
}

// --- File cache helpers ---
async function readCache(): Promise<{
  rate: number;
  fetchedAt: number;
} | null> {
  try {
    await ensureCacheFile();
    const data = await fs.readFile(CACHE_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err: any) {
    console.warn("Cache read failed, ignoring:", err.message);
    return null;
  }
}

async function writeCache(rate: number | Prisma.Decimal) {
  await ensureCacheFile();

  const value = rate instanceof Prisma.Decimal ? rate.toNumber() : rate;
  const tmpFile = CACHE_FILE + ".tmp";
  const data = JSON.stringify({ rate: value, fetchedAt: Date.now() });

  await fs.writeFile(tmpFile, data);
  await fs.rename(tmpFile, CACHE_FILE);
}

// --- Fetch fresh + persist to DB + cache ---
export async function fetchAndCacheRate() {
  try {
    const rateToman = await fetchFromNavasan();
    const rate = new Prisma.Decimal(rateToman);

    // persist to DB
    await db.exchangeRate.upsert({
      where: { source: "navasan" },
      update: { rateTomanPerUsd: rate, fetchedAt: new Date() },
      create: {
        source: "navasan",
        rateTomanPerUsd: rate,
        fetchedAt: new Date(),
      },
    });

    // persist to file cache
    await writeCache(rate);

    return {
      rateToman,
      source: "navasan",
      fetchedAt: new Date(),
      stale: false,
    };
  } catch (err) {
    console.error("Fetch from Navasan failed:", err);

    // fallback to last DB record
    const last = await db.exchangeRate.findFirst({
      orderBy: { fetchedAt: "desc" },
    });

    if (last) {
      return {
        rateToman: last.rateTomanPerUsd.toNumber(),
        source: last.source,
        fetchedAt: last.fetchedAt,
        stale: true,
      };
    }

    // final stale file fallback
    const staleFile = await readCache();
    if (staleFile && staleFile.rate > 0) {
      return {
        rateToman: staleFile.rate,
        source: "file-stale",
        fetchedAt: new Date(staleFile.fetchedAt),
        stale: true,
      };
    }

    throw err;
  }
}

// file → API → DB → stale file
export async function getLatestRate() {
  const DEFAULT_MAX_AGE_MS = DEFAULT_MAX_AGE_MIN * 60 * 1000;

  // 1 Try file cache first
  try {
    const cached = await readCache();
    if (cached && Date.now() - cached.fetchedAt < DEFAULT_MAX_AGE_MS) {
      return {
        rateToman: cached.rate,
        source: "file",
        fetchedAt: new Date(cached.fetchedAt),
        stale: false,
      };
    }
  } catch (_) {
    // ignore corrupted cache
  }

  // 2 Try API
  try {
    return await fetchAndCacheRate(); // marks stale=false internally
  } catch (apiErr) {
    console.warn("API failed, falling back to DB:", apiErr);
  }

  // 3 Fallback to DB
  const lastDb = await db.exchangeRate.findFirst({
    orderBy: { fetchedAt: "desc" },
  });
  if (lastDb) {
    return {
      rateToman: lastDb.rateTomanPerUsd.toNumber(),
      source: "db",
      fetchedAt: lastDb.fetchedAt,
      stale: true,
    };
  }

  // 4 Fallback to stale file
  // Only return file if it has a valid rate (>0)
  const cached = await readCache();
  if (cached && cached.rate > 0) {
    return {
      rateToman: cached.rate,
      source: "file-stale",
      fetchedAt: new Date(cached.fetchedAt),
      stale: true,
    };
  }

  // If cache empty or invalid → throw
  throw new Error("Unable to fetch exchange rate from API, DB, or cache");
}
