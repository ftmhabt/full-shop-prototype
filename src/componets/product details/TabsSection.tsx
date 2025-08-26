"use client";

import { ProductWithAttribute } from "@/app/actions/products";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabsSection({
  product,
}: {
  product: ProductWithAttribute;
}) {
  return (
    <section className="mt-8 w-full">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="flex rtl:flex-row-reverse gap-2 p-1 h-auto items-stretch  w-full">
          <TabsTrigger
            value="features"
            className="flex-1 basis-0       
        px-4 py-2
        rounded-lg
        min-w-0 truncate
        data-[state=active]:bg-white
        data-[state=active]:text-primary"
          >
            ویژگی‌ها
          </TabsTrigger>
          <TabsTrigger
            value="description"
            className="flex-1 basis-0       
        px-4 py-2
        rounded-lg
        min-w-0 truncate
        data-[state=active]:bg-white
        data-[state=active]:text-primary"
          >
            توضیحات
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="flex-1 basis-0       
        px-4 py-2
        rounded-lg
        min-w-0 truncate
        data-[state=active]:bg-white
        data-[state=active]:text-primary"
          >
            نظرات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="features">
          <ul className="border rounded-xl p-3 list-disc pr-10">
            {product.attributes?.map((attr) => (
              <li key={attr.id}>
                {attr.value.attribute.name}: {attr.value.value}
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="description">
          <p className="border rounded-xl p-3">{product.description}</p>
        </TabsContent>

        <TabsContent value="reviews">
          <p className="border rounded-xl p-3">No reviews yet.</p>
        </TabsContent>
      </Tabs>
    </section>
  );
}
