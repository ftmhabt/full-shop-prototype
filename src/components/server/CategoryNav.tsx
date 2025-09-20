import db from "@/lib/db";
import Link from "next/link";
import { DynamicIcon, IconName } from "../DynamicIcon";

export default async function CategoryNav() {
  const categories = await db.category.findMany({
    select: { id: true, name: true, slug: true, icon: true },
  });

  return (
    <>
      {categories.map((cat) => (
        <Link key={cat.id} href={`/category/${cat.slug}`}>
          <div className="flex items-center gap-1">
            <div>{cat.name}</div>{" "}
            <DynamicIcon iconName={cat.icon as IconName} size={14} />
          </div>
        </Link>
      ))}
    </>
  );
}
