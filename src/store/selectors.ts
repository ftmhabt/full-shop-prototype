import { RootState } from "./index";

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectTotalItems = (state: RootState) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectTotalPrice = (state: RootState) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const selectCartTotalPrice = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
