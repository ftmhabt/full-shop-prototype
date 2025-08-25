"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function RelatedProducts({
  categoryId,
}: {
  categoryId: string;
}) {
  const [related, setRelated] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Replace with API fetch
    setRelated([
      {
        id: "1",
        name: "Sample Related Product",
        price: 99,
        image: "/placeholder.png",
      },
    ]);
  }, [categoryId]);

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Related Products</h2>
      <motion.div className="flex gap-4 overflow-x-auto pb-4">
        {related.map((p) => (
          <Card key={p.id} className="min-w-[200px]">
            <CardContent className="p-2 flex flex-col">
              <div className="relative h-40">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <h3 className="mt-2 font-medium">{p.name}</h3>
              <p className="text-sm">${p.price}</p>
              <Button size="sm" className="mt-2">
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </section>
  );
}
