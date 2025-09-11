import { customAlphabet } from "nanoid";

export function generateOrderId() {
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const nanoid = customAlphabet(alphabet, 6);
  return `ORD-${nanoid()}`;
}
