/**
 * Recursively adds `priceToman` and `oldPriceToman` to any object or array that has `price` or `oldPrice`.
 */

import { usdToToman } from "@/lib/exchange";

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

  // Add priceToman / oldPriceToman if applicable
  if (typeof result.price === "number") {
    result.priceToman = await usdToToman(result.price);
  }
  if (typeof result.oldPrice === "number") {
    result.oldPriceToman = await usdToToman(result.oldPrice);
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
