export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fa-IR").format(amount);
}

export const persianNumber = (num: number) =>
  new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 1 }).format(num);
