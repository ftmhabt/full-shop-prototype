"use client";

import { createReview, getReviews } from "@/app/actions/reviews";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ProductWithAttributes } from "@/types";
import { useEffect, useState, useTransition } from "react";

export default function TabsSection({
  product,
}: {
  product: ProductWithAttributes;
}) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [isPending, startTransition] = useTransition();

  async function loadReviews() {
    const data = await getReviews(product.id);
    setReviews(data);
  }

  useEffect(() => {
    loadReviews();
  }, [product.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    startTransition(async () => {
      try {
        await createReview({ productId: product.id, content, rating });
        setContent("");
        setRating(5);
        await loadReviews();
      } catch (err) {
        console.error(err);
      }
    });
  }

  return (
    <section className="mt-8 w-full">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="flex rtl:flex-row-reverse gap-2 p-1 h-auto items-stretch  w-full">
          <TabsTrigger
            value="features"
            className="flex-1 basis-0 px-4 py-2 rounded-lg min-w-0 truncate data-[state=active]:text-primary"
          >
            ویژگی‌ها
          </TabsTrigger>
          <TabsTrigger
            value="description"
            className="flex-1 basis-0 px-4 py-2 rounded-lg min-w-0 truncate data-[state=active]:text-primary"
          >
            توضیحات
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="flex-1 basis-0 px-4 py-2 rounded-lg min-w-0 truncate data-[state=active]:text-primary"
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
          <div className="border rounded-xl p-4 space-y-6" dir="rtl">
            {/* Existing Reviews */}
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="border rounded-lg p-3 bg-muted/30">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold">
                        {r.user.displayName || "کاربر"}
                      </p>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-lg ${
                              star <= r.rating
                                ? "text-yellow-500"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm mt-2">{r.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                هنوز نظری ثبت نشده است. اولین نفر باشید!
              </p>
            )}

            {/* New Review Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-3 border-t pt-4"
              dir="rtl"
            >
              <div className="space-y-2 flex items-center gap-2">
                <label className="block text-sm font-medium">
                  امتیاز شما به این محصول:
                </label>
                <div className="flex gap-2 pb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setRating(star)}
                      className={`text-2xl transition ${
                        rating >= star
                          ? "text-yellow-500"
                          : "text-gray-300 hover:text-yellow-400"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="تجربه‌ی خود را درباره این محصول بنویسید..."
                  className="min-h-[100px]"
                />
              </div>

              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "در حال ارسال..." : "ثبت نظر"}
              </Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
