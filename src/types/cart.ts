export interface CartItem {
  id: string; // productId
  name?: string;
  price?: number;
  quantity: number;
  image?: string | null;
}
