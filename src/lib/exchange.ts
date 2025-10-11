"use server";
import { getLatestRate } from "./latestRate";
const MARKUP_PERCENT = 30; // if needed later

export async function tomanToUsdWithMarkup(
  basePriceToman: number,
  applyMarkup = true
): Promise<number> {
  if (!basePriceToman) throw new Error("base price required");

  const { rateToman } = await getLatestRate();

  // convert to USD
  let usd = basePriceToman / rateToman;

  // apply markup
  if (applyMarkup) usd *= 1 + MARKUP_PERCENT / 100;

  // no rounding in USD
  return Number(usd);
}

export async function usdToToman(usdPrice: number): Promise<number> {
  const { rateToman } = await getLatestRate();

  const toman = usdPrice * rateToman;

  return Number(Math.round(toman));
}
