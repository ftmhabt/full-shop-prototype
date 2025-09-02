"use client";
import Link from "next/link";
import { Button } from "../ui/button";

function CategorySection({
  categories,
}: {
  categories: {
    id: number;
    label: string;
    slug: string;
    icon: React.ReactNode;
  }[];
}) {
  return (
    <section className="mt-6">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {categories.map((c) => (
          <IconCategory
            key={c.id}
            label={c.label}
            icon={c.icon}
            link={`/category/${c.slug}`}
          />
        ))}
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
    <Link href={link}>
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
