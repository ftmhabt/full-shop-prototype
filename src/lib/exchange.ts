"use server";
import { cache } from "react";
import db from "./db";
import { getLatestRate } from "./latestRate";

const getConstants = cache(async () => {
  const constants = await db.constants.findFirst();
  return constants ?? { markupPercent: 30 };
});

export async function tomanToUsdWithMarkup(
  basePriceToman: number,
  applyMarkup = true
): Promise<number> {
  if (!basePriceToman) throw new Error("base price required");

  const { rateToman } = await getLatestRate();
  const { markupPercent } = await getConstants();

  // convert to USD
  let usd = basePriceToman / rateToman;

  // apply markup
  if (applyMarkup) usd *= 1 + markupPercent / 100;

  // no rounding in USD
  return Number(usd);
}

export async function usdToToman(usdPrice: number): Promise<number> {
  const { rateToman } = await getLatestRate();

  const toman = usdPrice * rateToman;

  return Number(Math.round(toman));
}
