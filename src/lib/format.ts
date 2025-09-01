export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fa-IR").format(amount);
}
