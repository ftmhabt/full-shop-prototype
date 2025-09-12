import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  isLoaded: boolean;
}

const initialState: CartState = {
  items: [],
  isLoaded: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    hydrate(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      state.isLoaded = true;
    },

    add(
      state,
      action: PayloadAction<Omit<CartItem, "createdAt" | "updatedAt">>
    ) {
      const item = action.payload;
      const existing = state.items.find((i) => i.id === item.id);

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.items.push({
          ...item,
        });
      }

      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    increase(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    decrease(state, action: PayloadAction<string>) {
      const item = state.items.find((i) => i.id === action.payload);
      if (!item) return;
      if (item.quantity <= 1) {
        state.items = state.items.filter((i) => i.id !== action.payload);
      } else {
        item.quantity -= 1;
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    remove(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    clear(state) {
      state.items = [];
      localStorage.removeItem("cart");
    },
  },
});

export const { add, increase, decrease, remove, clear, hydrate } =
  cartSlice.actions;
export default cartSlice.reducer;
