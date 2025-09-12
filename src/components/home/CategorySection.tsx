"use client";
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
import { Button } from "../ui/button";

// Same icons as IconPicker
export const ICONS = {
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

export type IconName = keyof typeof ICONS;

export interface Category {
  id: string;
  label: string;
  slug: string;
  icon?: IconName;
}

function CategorySection({ categories }: { categories: Category[] }) {
  return (
    <section className="mt-6">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {categories.map((c) => {
          const IconComponent = c.icon ? ICONS[c.icon] : Box; // c.icon is now a valid IconName

          return (
            <IconCategory
              key={c.id}
              label={c.label}
              icon={<IconComponent className="h-6 w-6" />}
              link={`/category/${c.slug}`}
            />
          );
        })}
      </div>
    </section>
  );
}

export default CategorySection;

function IconCategory({
  label,
  icon,
  link,
}: {
  label: string;
  icon: React.ReactNode;
  link: string;
}) {
  return (
    <Link href={link} className="flex items-center justify-center">
      <Button
        variant="ghost"
        className="flex h-auto flex-col items-center gap-3 rounded-2xl p-4"
      >
        <div className="rounded-2xl bg-primary/10 p-3 text-primary">{icon}</div>
        <span className="text-xs">{label}</span>
      </Button>
    </Link>
  );
}
