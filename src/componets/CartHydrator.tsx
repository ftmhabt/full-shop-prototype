"use client";

import { useCart } from "@/store/useCart";
import { useEffect } from "react";

export default function CartHydrator() {
  useEffect(() => {
    // Triggers reading from localStorage on client only (because skipHydration: true)
    useCart.persist.rehydrate();
  }, []);
  return null;
}
