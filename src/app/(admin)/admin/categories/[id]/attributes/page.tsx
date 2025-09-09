import { AttributesList } from "@/components/admin/AttributesList";
import { CreateAttributeDialog } from "@/components/admin/CreateAttributeDialog";
import { db } from "@/lib/db";

export default async function CategoryAttributesPage({ params }: any) {
  const category = await db.category.findFirst({
    where: { id: params.id },
    include: {
      attributes: { include: { values: true } },
    },
  });

  if (!category) return <div>دسته یافت نشد</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-start sm:justify-between items-start sm:items-center gap-4 ">
        <h1 className="text-2xl font-bold">
          مدیریت ویژگی‌ها - {category.name}
        </h1>
        <CreateAttributeDialog categoryId={category.id} />
      </div>
      <AttributesList
        attributes={category.attributes}
        categoryId={category.id}
      />
    </div>
  );
}
