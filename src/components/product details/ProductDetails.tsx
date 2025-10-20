"use client";

import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { selectCartItems } from "@/store/selectors";
import { StandardizedProduct } from "@/types";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FallbackImage } from "../FallbackImage";
import Price from "../home/Price";
import QuantitySelector from "./QuantitySelector";
import Rating from "./Rating";
import RelatedProducts from "./RelatedProducts";
import ShippingAndServiceCard from "./ShippingAndServiceCard";
import TabsSection from "./TabsSection";
import WhyUsCard from "./WhyUsCard";

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

  const discountPercent = product.oldPriceToman
    ? Math.round(
        ((product.oldPriceToman - product.priceToman) / product.oldPriceToman) *
          100
      )
    : 0;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* مسیر صفحه */}
      <nav className="mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">خانه</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="rotate-180" />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/category/${product.category?.slug ?? ""}`}
              >
                {product.category?.name ?? "دسته‌بندی"}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="rotate-180" />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </nav>

      {/* بخش بالا */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
        {/* سمت چپ: تصویر */}
        <div>
          <h2 className="sr-only">تصاویر محصول</h2>
          <div className="aspect-square relative border mb-2 rounded-2xl">
            <FallbackImage
              src={activeImage}
              alt={product.name}
              fill
              className="object-contain rounded-2xl"
              priority={activeImage === product.image[0]}
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
                  priority={activeImage === product.image[0]}
                  unoptimized
                />
              </button>
            ))}
          </div>
        </div>

        {/* وسط: اطلاعات */}
        <div className="flex flex-col space-y-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>

          <h2>
            <Price
              value={product.priceToman}
              old={product.oldPriceToman}
              size="lg"
            />
          </h2>
          <div className="flex gap-1 absolute right-2 top-2 ">
            {product.badge && (
              <Badge className="rounded-full px-3 py-1 text-xs">
                {product.badge}
              </Badge>
            )}
            {product.oldPriceToman && (
              <Badge className="rounded-full px-3 py-1 text-xs">
                {discountPercent + "%"}
              </Badge>
            )}
          </div>
          <div>
            <h3 className="sr-only">امتیاز محصول</h3>
            <Rating value={averageRating} />
          </div>
          <Badge variant="secondary">موجود در انبار</Badge>
          <div>
            <h3 className="font-semibold mt-2 mb-1">توضیحات محصول</h3>
            <p>{product.summary}</p>
          </div>
          <div>
            <QuantitySelector
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                priceToman: product.priceToman,
                quantity,
                image: product.image?.[0] ?? "",
              }}
            />
          </div>
          <div className="flex space-x-2 mt-2">
            <Badge>گارانتی</Badge>
            <Badge>پرداخت امن</Badge>
            <Badge>ارسال سریع</Badge>
          </div>
        </div>

        {/* راست: گارانتی */}
        <div className="space-y-4 bg-card sm:col-span-2 md:col-span-1">
          <ShippingAndServiceCard />
          <WhyUsCard />
        </div>
      </div>

      {/* تب‌ها */}
      <section className="mt-8">
        <TabsSection product={product} />
      </section>

      {/* محصولات مرتبط */}
      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">محصولات مرتبط</h2>
        <RelatedProducts categorySlug={product.category.slug} />
      </section>
    </div>
  );
}
