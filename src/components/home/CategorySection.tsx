"use client";

import { Button } from "@/components/ui/button";
import {
  Bell,
  Box,
  Cable,
  Camera,
  Home,
  Key,
  Lock,
  Shield,
  ShoppingCart,
  Siren,
  User,
  Wifi,
} from "lucide-react";
import Link from "next/link";

// ---- Icon Map (consistent with constants) -------------------

export const ICONS_MAP = {
  Siren,
  Camera,
  Cable,
  Lock,
  Shield,
  Box,
  User,
  ShoppingCart,
  Home,
  Key,
  Bell,
  Wifi,
} as const;

export type IconName = keyof typeof ICONS_MAP;

// ---- Types ---------------------------------------------------

export interface Category {
  id: string;
  label: string;
  slug: string;
  icon?: IconName;
}

// ---- Components ----------------------------------------------

export default function CategorySection({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <section className="mt-6">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {categories.map((category) => (
          <CategoryItem key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}

// ---- Subcomponent --------------------------------------------

function CategoryItem({ category }: { category: Category }) {
  const IconComponent = category.icon ? ICONS_MAP[category.icon] : Box;

  return (
    <Link href={`/category/${category.slug}`} className="flex justify-center">
      <Button
        variant="ghost"
        className="flex h-auto flex-col items-center gap-3 rounded-2xl p-4 transition-colors hover:bg-muted"
      >
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">
          <IconComponent className="h-6 w-6" />
        </div>
        <span className="text-xs">{category.label}</span>
      </Button>
    </Link>
  );
}
