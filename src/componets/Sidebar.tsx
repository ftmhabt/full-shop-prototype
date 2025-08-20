"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import Link from "next/link";

export function Sidebar({
  categories,
  selected,
}: {
  categories: Category[];
  selected?: string;
}) {
  return (
    <Card className="rounded-2xl shadow p-4">
      <CardContent className="flex flex-col gap-2">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className={cn(
              "p-2 rounded-lg hover:bg-gray-100",
              selected === cat.slug && "bg-gray-200 font-semibold"
            )}
          >
            {cat.name}
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
