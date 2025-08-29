import { CartItem } from "@/app/actions/cart";
import { create } from "zustand";

interface CartState {
  items: CartItem[];
  setItems: (items: CartItem[]) => void;
}

export const useCart = create<CartState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
}));
