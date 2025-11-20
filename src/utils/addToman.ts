/**
 * Recursively adds `priceToman` and `oldPriceToman` to any object or array that has `price` or `oldPrice`.
 */

import { getRateCached } from "@/lib/exchangeCache";
import { getLatestRate } from "@/lib/latestRate";

export type Priceable = {
  price?: number;
  oldPrice?: number | null;
};

/**
 * Recursively maps a type to include Toman prices for all priceable fields.
 */
export type WithTomanRecursive<T> = T extends {
  price?: number;
  oldPrice?: number | null;
}
  ? T & { priceToman?: number; oldPriceToman?: number | null }
  : T extends Array<infer U>
  ? WithTomanRecursive<U>[]
  : T extends object
  ? { [K in keyof T]: WithTomanRecursive<T[K]> }
  : T;

export async function addTomanPrices<T>(
  data: T
): Promise<WithTomanRecursive<T>> {
  if (Array.isArray(data)) {
    return (await Promise.all(
      data.map((item) => addTomanPrices(item))
    )) as WithTomanRecursive<T>;
  }

  if (typeof data !== "object" || data === null) {
    return data as WithTomanRecursive<T>;
  }

  const result = { ...data } as any;

  const rate = await getRateCached(getLatestRate);

  // Add priceToman / oldPriceToman if applicable
  if (typeof result.price === "number") {
    result.priceToman = Math.round(result.price * rate);
  }
  if (typeof result.oldPrice === "number") {
    result.oldPriceToman = Math.round(result.oldPrice * rate);
  }

  // Recursively apply to nested objects/arrays
  for (const key in result) {
    if (!Object.prototype.hasOwnProperty.call(result, key)) continue;

    const value = result[key];

    if (Array.isArray(value) || (typeof value === "object" && value !== null)) {
      result[key] = await addTomanPrices(value);
    }
  }

  return result as WithTomanRecursive<T>;
}
