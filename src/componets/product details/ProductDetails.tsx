"use client";

import { ProductWithAttribute } from "@/app/actions/products";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useCartServer } from "@/hooks/useCartServer";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import QuantitySelector from "./QuantitySelector";
import RelatedProducts from "./RelatedProducts";
import TabsSection from "./TabsSection";

export default function ProductDetails({
  product,
}: {
  product: ProductWithAttribute;
}) {
  const [activeImage, setActiveImage] = useState(product.image[0]);
  const { items, add, increase, decrease } = useCartServer();

  const cartItem = items.find((i) => i.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    add({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image[0],
      quantity: 1,
    });
    toast.success(`${product.name} به سبد اضافه شد`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* مسیر صفحه */}
      <nav className="text-sm mb-4">
        <ol className="flex space-x-2">
          <li>خانه</li>
          <li>{">"}</li>
          <li>{product.category?.name ?? "دسته‌بندی"}</li>
          <li>{">"}</li>
          <li className="font-semibold">{product.name}</li>
        </ol>
      </nav>

      {/* بخش بالا */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* سمت چپ: تصویر */}
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
                  alt={`تصویر کوچک ${i + 1}`}
                  fill
                  className="object-cover rounded-lg"
                  unoptimized
                />
              </button>
            ))}
          </div>
        </div>

        {/* سمت راست: اطلاعات */}
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-xl font-semibold">{product.price} تومان</p>
          <Badge variant="secondary">موجود در انبار</Badge>
          <p>{product.description}</p>
          <QuantitySelector product={product} quantity={quantity} />

          <div className="flex space-x-2 mt-2">
            <Badge>گارانتی</Badge>
            <Badge>پرداخت امن</Badge>
            <Badge>ارسال سریع</Badge>
          </div>
        </div>

        {/* سمت راست: اطلاعات */}
        <Card className="flex flex-col space-y-4 p-5 bg-gray-100 ">
          <p>
            این لپ‌تاپ جدید با طراحی باریک و سبک، ترکیبی از عملکرد بالا و ظرافت
            را ارائه می‌دهد. پردازنده‌های نسل جدید آن امکان اجرای نرم‌افزارهای
            سنگین و چندوظیفگی همزمان را به‌خوبی فراهم می‌کنند، در حالی که کارت
            گرافیک قدرتمند تجربه‌ی بازی و طراحی گرافیکی روان و بدون لگ را ممکن
            می‌سازد. صفحه‌نمایش با کیفیت بالا و رنگ‌های دقیق، تماشای فیلم و کار
            با تصاویر را لذت‌بخش می‌کند و باتری با طول عمر بالا، آزادی حرکت و
            کار طولانی‌مدت را بدون نیاز به شارژ مداوم فراهم می‌آورد.
          </p>
        </Card>
      </div>

      {/* تب‌ها */}
      <TabsSection product={product} />

      {/* محصولات مرتبط */}
      <RelatedProducts categoryId={product.category.id} />
    </div>
  );
}
