export function generateOrderId() {
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const length = 6;
  let result = "";

  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < length; i++) {
    result += alphabet[randomValues[i] % alphabet.length];
  }

  return `ORD-${result}`;
}
