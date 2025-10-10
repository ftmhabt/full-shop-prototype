"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { selectCartItems } from "@/store/selectors";
import { StandardizedProduct } from "@/types";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FallbackImage } from "../FallbackImage";
import QuantitySelector from "./QuantitySelector";
import Rating from "./Rating";
import RelatedProducts from "./RelatedProducts";
import TabsSection from "./TabsSection";

export default function ProductDetails({
  product,
}: {
  product: StandardizedProduct;
}) {
  const [activeImage, setActiveImage] = useState(product.image[0]);
  const items = useSelector(selectCartItems);

  const cartItem = items.find((i) => i.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
      : 0;

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
            <FallbackImage
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
                  activeImage === img ? "border-primary" : ""
                }`}
              >
                <FallbackImage
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
          <p className="text-xl font-semibold">{product.priceToman} تومان</p>
          <Rating value={averageRating} />

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
        <Card className="flex flex-col p-5 bg-card ">
          <h2>گارانتی محصول: تعهد ما به کیفیت و رضایت شما</h2>
          <p>
            گارانتی یک محصول، در واقع تعهد رسمی و قانونی شرکت تولیدکننده یا
            فروشنده به مشتری است که اطمینان می‌دهد کالا مطابق با استانداردهای
            تعیین‌شده و بدون نقص به دست مصرف‌کننده می‌رسد و در صورت بروز هرگونه
            مشکل ناشی از کیفیت ساخت یا عملکرد محصول در مدت زمان مشخص، مشتری
            می‌تواند از خدمات تعمیر، تعویض یا بازپرداخت بهره‌مند شود. هدف اصلی
            گارانتی، ایجاد اعتماد و اطمینان خاطر برای مشتری است تا با خیال راحت
            محصول را خریداری و استفاده کند.
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
