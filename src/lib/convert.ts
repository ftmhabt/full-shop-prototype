import { Decimal } from "@prisma/client/runtime/library";

export function serializePrisma<T>(obj: T): T {
  if (obj instanceof Decimal) {
    return Number(obj.toString()) as unknown as T;
  }
  if (obj instanceof Date) {
    return obj.toISOString() as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map(serializePrisma) as unknown as T;
  }
  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, serializePrisma(v)])
    ) as unknown as T;
  }
  return obj;
}
