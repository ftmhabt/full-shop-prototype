import {
  addItem,
  clearCart,
  decreaseQty,
  increaseQty,
  removeItem,
} from "@/app/actions/cart";
import { getCart } from "@/lib/cart";
import { CartItem } from "@/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const {
    action,
    itemId,
    item,
  }: { action: string; itemId?: string; item?: CartItem } = body;

  switch (action) {
    case "add":
      if (!item) throw new Error("Item missing");
      await addItem(item);
      break;
    case "remove":
      if (!itemId) throw new Error("ItemId missing");
      await removeItem(itemId);
      break;
    case "clear":
      await clearCart();
      break;
    case "increase":
      if (!itemId) throw new Error("ItemId missing");
      await increaseQty(itemId);
      break;
    case "decrease":
      if (!itemId) throw new Error("ItemId missing");
      await decreaseQty(itemId);
      break;
    default:
      throw new Error("Unknown action");
  }

  const cart = await getCart();
  return NextResponse.json(cart);
}

export async function GET() {
  const cart = await getCart();
  return NextResponse.json(cart);
}
