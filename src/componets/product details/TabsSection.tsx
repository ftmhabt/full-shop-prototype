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
        <TabsList className="w-full justify-start rtl:justify-end">
          <TabsTrigger value="features" className="w-full">
            Features
          </TabsTrigger>
          <TabsTrigger value="description" className="w-full">
            Description
          </TabsTrigger>
          <TabsTrigger value="reviews" className="w-full">
            Reviews
          </TabsTrigger>
        </TabsList>

        <TabsContent value="features">
          <ul className="list-disc pl-6">
            {product.attributes?.map((attr) => (
              <li key={attr.id}>
                {attr.value.attribute.name}: {attr.value.value}
              </li>
            ))}
          </ul>
        </TabsContent>

        <TabsContent value="description">
          <p>{product.description}</p>
        </TabsContent>

        <TabsContent value="reviews">
          <p>No reviews yet.</p>
        </TabsContent>
      </Tabs>
    </section>
  );
}
