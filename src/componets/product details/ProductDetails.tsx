"use client";

import { ProductWithAttribute } from "@/app/actions/products";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/store/useCart";
import Image from "next/image";
import { useState } from "react";
import QuantitySelector from "./QuantitySelector";
import RelatedProducts from "./RelatedProducts";
import TabsSection from "./TabsSection";

export default function ProductDetails({
  product,
}: {
  product: ProductWithAttribute;
}) {
  const [activeImage, setActiveImage] = useState(product.image[0]);
  const addItem = useCart((s) => s.addItem);
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image[0],
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumbs */}
      <nav className="text-sm mb-4">
        <ol className="flex space-x-2">
          <li>خانه</li>
          <li>{">"}</li>
          <li>{product.category?.name ?? "Category"}</li>
          <li>{">"}</li>
          <li className="font-semibold">{product.name}</li>
        </ol>
      </nav>

      {/* Top Section */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: Image */}
        <div>
          <div className="aspect-square relative border mb-2 rounded-2xl">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              className="object-contain rounded-2xl"
              unoptimized
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {product.image.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`w-16 h-16 relative border rounded-lg ${
                  activeImage === img ? "border-blue-500" : ""
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  className="object-cover rounded-lg"
                  unoptimized
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col space-y-4 md:col-span-2">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-xl font-semibold">${product.price}</p>
          <Badge variant="secondary">In Stock</Badge>
          <p>{product.description}</p>
          <QuantitySelector qty={qty} setQty={setQty} />

          <div className="flex space-x-2 mt-2">
            <Badge>Warranty</Badge>
            <Badge>Secure Payment</Badge>
            <Badge>Fast Delivery</Badge>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <TabsSection product={product} />

      {/* Related */}
      <RelatedProducts categoryId={product.category.id} />
    </div>
  );
}
