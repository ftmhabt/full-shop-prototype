import axios from "axios";
import fs from "fs/promises";
import * as exchange from "./exchange";

// --- Mock axios ---
jest.mock("axios");

// --- Mock db ---
jest.mock("./db", () => ({
  __esModule: true,
  default: {
    exchangeRate: {
      upsert: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

// --- Import after mocking ---
import db from "./db";

// --- Type helpers ---
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedDb = db as unknown as {
  exchangeRate: {
    upsert: jest.Mock<any, any>;
    findFirst: jest.Mock<any, any>;
  };
};

describe("exchange rate service", () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    // Reset cache file to empty/fresh state before each test
    await fs.writeFile(
      "./rateCache.json",
      JSON.stringify({ rate: 0, fetchedAt: 0 })
    );
  });

  it("returns fresh file cache if available", async () => {
    const cached = { rate: 50000, fetchedAt: Date.now() };
    await fs.writeFile("./rateCache.json", JSON.stringify(cached));

    const result = await exchange.getLatestRate();

    expect(result.source).toBe("file");
    expect(result.stale).toBe(false);
    expect(result.rateToman).toBe(50000);
    expect(mockedAxios.get).not.toHaveBeenCalled();
    expect(mockedDb.exchangeRate.findFirst).not.toHaveBeenCalled();
  });

  it("fetches from API if cache is stale/missing", async () => {
    await fs.writeFile(
      "./rateCache.json",
      JSON.stringify({ rate: 0, fetchedAt: 0 })
    );
    mockedAxios.get.mockResolvedValueOnce({ data: { usd: { value: 60000 } } });
    mockedDb.exchangeRate.upsert.mockResolvedValue({});

    const result = await exchange.getLatestRate();

    expect(result.source).toBe("navasan");
    expect(result.stale).toBe(false);
    expect(result.rateToman).toBe(60000);
    expect(mockedDb.exchangeRate.upsert).toHaveBeenCalled();
  });

  it("falls back to DB if API fails", async () => {
    await fs.writeFile(
      "./rateCache.json",
      JSON.stringify({ rate: 0, fetchedAt: 0 })
    );
    mockedAxios.get.mockRejectedValueOnce(new Error("API down"));
    mockedDb.exchangeRate.findFirst.mockResolvedValue({
      rateTomanPerUsd: { toNumber: () => 47000 },
      source: "db",
      fetchedAt: new Date(),
    });

    const result = await exchange.getLatestRate();

    expect(result.source).toBe("db");
    expect(result.stale).toBe(true);
    expect(result.rateToman).toBe(47000);
  });
  it("falls back to stale file if API and DB fail", async () => {
    const staleFile = {
      rate: 48000,
      fetchedAt: Date.now() - 1000 * 60 * 60 * 24,
    };
    await fs.writeFile("./rateCache.json", JSON.stringify(staleFile));
    mockedAxios.get.mockRejectedValueOnce(new Error("API down"));
    mockedDb.exchangeRate.findFirst.mockResolvedValue(null);

    const result = await exchange.getLatestRate();

    expect(result.source).toBe("file-stale");
    expect(result.stale).toBe(true);
    expect(result.rateToman).toBe(48000);
  });

  it("throws if API, DB, and cache fail", async () => {
    // empty cache
    await fs.writeFile(
      "./rateCache.json",
      JSON.stringify({ rate: 0, fetchedAt: 0 })
    );
    mockedAxios.get.mockRejectedValueOnce(new Error("API down"));
    mockedDb.exchangeRate.findFirst.mockResolvedValue(null);

    await expect(exchange.getLatestRate()).rejects.toThrow(
      "Unable to fetch exchange rate from API, DB, or cache"
    );
  });

  it("handles corrupted cache gracefully", async () => {
    await fs.writeFile("./rateCache.json", "not-json");
    mockedAxios.get.mockResolvedValueOnce({ data: { usd: { value: 49000 } } });
    mockedDb.exchangeRate.upsert.mockResolvedValue({});

    const result = await exchange.getLatestRate();

    expect(result.rateToman).toBe(49000);
    expect(["navasan", "db", "file-stale"]).toContain(result.source);
  });
});
