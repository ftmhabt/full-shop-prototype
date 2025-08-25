// store/useCart.ts
import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  hasHydrated: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  clearCart: () => void;
  setHasHydrated: (v: boolean) => void;
}

const storage: StateStorage = {
  getItem: (name) => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(name);
  },
  setItem: (name, value) => {
    if (typeof window !== "undefined") localStorage.setItem(name, value);
  },
  removeItem: (name) => {
    if (typeof window !== "undefined") localStorage.removeItem(name);
  },
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
              totalItems: state.totalItems + 1,
              totalPrice: state.totalPrice + item.price,
            };
          }
          return {
            items: [...state.items, { ...item, quantity: 1 }],
            totalItems: state.totalItems + 1,
            totalPrice: state.totalPrice + item.price,
          };
        }),

      removeItem: (id) =>
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          if (!item) return state;
          return {
            items: state.items.filter((i) => i.id !== id),
            totalItems: state.totalItems - item.quantity,
            totalPrice: state.totalPrice - item.price * item.quantity,
          };
        }),

      increaseQty: (id) =>
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          if (!item) return state;
          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + 1 } : i
            ),
            totalItems: state.totalItems + 1,
            totalPrice: state.totalPrice + item.price,
          };
        }),

      decreaseQty: (id) =>
        set((state) => {
          const item = state.items.find((i) => i.id === id);
          if (!item) return state;
          if (item.quantity === 1) {
            return {
              items: state.items.filter((i) => i.id !== id),
              totalItems: state.totalItems - 1,
              totalPrice: state.totalPrice - item.price,
            };
          }
          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i
            ),
            totalItems: state.totalItems - 1,
            totalPrice: state.totalPrice - item.price,
          };
        }),

      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => storage),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// === SELECTORS ===
export const useCartCount = () => useCart((s) => s.totalItems);
export const useCartTotal = () => useCart((s) => s.totalPrice);
export const useCartHydrated = () => useCart((s) => s.hasHydrated);
