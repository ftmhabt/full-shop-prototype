import { RootState } from "./index";

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectTotalItems = (state: RootState) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectTotalPrice = (state: RootState) =>
  state.cart.items.reduce((sum, i) => sum + i.priceToman * i.quantity, 0);
export const selectCartTotalPrice = (state: RootState) =>
  state.cart.items.reduce(
    (sum, item) => sum + item.priceToman * item.quantity,
    0
  );
