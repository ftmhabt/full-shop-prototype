"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { add } from "@/store/cartSlice";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { FallbackImage } from "../FallbackImage";

type Product = {
  id: string;
  name: string;
  price: number;
  priceToman: number;
  image: string[];
  stock?: number;
};

type Category = {
  id: string;
  name: string;
  products: Product[];
};

export default function DeviceBuilder({
  categoriesProp,
}: {
  categoriesProp: Category[];
}) {
  const categories = categoriesProp;
  const [selected, setSelected] = useState<Record<string, string | null>>({});
  const [adding, setAdding] = useState<"INDIVIDUAL" | "BUNDLE" | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const initial: Record<string, string | null> = {};
    categories.forEach((c) => (initial[c.id] = null));
    setSelected(initial);
  }, [categories]);

  const selectedProducts = useMemo(() => {
    return categories
      .map((c) => {
        const pid = selected[c.id];
        if (!pid) return null;
        return c.products.find((x) => x.id === pid) || null;
      })
      .filter(Boolean) as Product[];
  }, [categories, selected]);

  const total = useMemo(
    () => selectedProducts.reduce((s, p) => s + p.priceToman, 0),
    [selectedProducts]
  );

  // ✅ Add products individually
  async function handleAddIndividually() {
    if (selectedProducts.length === 0) return;
    setAdding("INDIVIDUAL");

    try {
      selectedProducts.forEach((p) => {
        dispatch(
          add({
            id: p.id,
            name: p.name,
            price: p.priceToman,
            priceToman: p.priceToman,
            quantity: 1,
            image: p.image?.[0],
            type: "PRODUCT",
          })
        );
      });

      toast.success("محصولات به صورت جداگانه اضافه شدند");
    } catch (err) {
      console.error(err);
      toast.error("خطا در اضافه کردن محصولات");
    } finally {
      setAdding(null);
    }
  }

  // ✅ Add as bundle
  async function handleAddAsBundle() {
    if (selectedProducts.length === 0) return;
    setAdding("BUNDLE");

    try {
      dispatch(
        add({
          id: `bundle-${Date.now().toLocaleString()}`,
          type: "BUNDLE",
          name: "دستگاه سفارشی",
          price: total,
          priceToman: total,
          quantity: 1,
          image: selectedProducts[0]?.image?.[0],
          bundleItems: selectedProducts.map((p) => ({
            productId: p.id,
            name: p.name,
            price: p.priceToman,
            quantity: 1,
          })),
        })
      );

      toast.success("محصولات به صورت بسته اضافه شدند");
    } catch (err) {
      console.error(err);
      toast.error("خطا در اضافه کردن بسته");
    } finally {
      setAdding(null);
    }
  }

  return (
    <div className="space-y-6 p-6 w-full">
      <h2 className="text-2xl font-semibold">دستگاه خودت رو بساز</h2>

      <div className="flex flex-col sm:flex-row gap-6 relative">
        <div className="space-y-4 min-w-1/3 w-full">
          {categories.map((cat) => (
            <Card key={cat.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{cat.name}</span>
                  <Badge variant="secondary">{cat.products.length} گزینه</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="w-48">
                    <Select
                      disabled={cat.products.length <= 0}
                      value={selected[cat.id] ?? ""}
                      onValueChange={(val) =>
                        setSelected((s) => ({ ...s, [cat.id]: val || null }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={`یک ${cat.name} انتخاب کن`} />
                      </SelectTrigger>
                      <SelectContent>
                        {cat.products.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1 flex items-center gap-4">
                    {selected[cat.id] ? (
                      (() => {
                        const prod = cat.products.find(
                          (x) => x.id === selected[cat.id]
                        )!;
                        return (
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-20 relative rounded-md overflow-hidden bg-muted">
                              {prod.image?.[0] ? (
                                <FallbackImage
                                  src={prod.image[0]}
                                  alt={prod.name}
                                  fill
                                  style={{ objectFit: "cover" }}
                                />
                              ) : (
                                <div className="flex items-center justify-center w-full h-full">
                                  بدون تصویر
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{prod.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {prod.priceToman.toLocaleString()} تومان
                              </div>
                              {typeof prod.stock === "number" &&
                                prod.stock <= 0 && (
                                  <div className="text-xs text-red-600">
                                    ناموجود
                                  </div>
                                )}
                            </div>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        انتخابی نشده
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <aside className="sticky top-6 self-start w-full">
          <Card>
            <CardHeader>
              <CardTitle>انتخاب‌های شما</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedProducts.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    هیچ قطعه‌ای انتخاب نشده
                  </div>
                )}
                {selectedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 relative rounded overflow-hidden bg-muted">
                        {p.image?.[0] ? (
                          <FallbackImage
                            src={p.image[0]}
                            alt={p.name}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full">
                            —
                          </div>
                        )}
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {p.priceToman.toLocaleString()} تومان
                        </div>
                      </div>
                    </div>
                    <div className="text-sm">
                      {p.priceToman.toLocaleString()}
                    </div>
                  </div>
                ))}
                <Separator className="my-2" />
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">مجموع</div>
                  <div className="font-semibold">
                    {total.toLocaleString()} تومان
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={handleAddAsBundle}
                disabled={selectedProducts.length === 0 || adding !== null}
              >
                افزودن به صورت محصول سفارشی
              </Button>
              <Button
                onClick={handleAddIndividually}
                disabled={selectedProducts.length === 0 || adding !== null}
                variant="outline"
              >
                افزودن جداگانه
              </Button>

              <Button
                onClick={() => {
                  const initial: Record<string, string | null> = {};
                  categories.forEach((c) => (initial[c.id] = null));
                  setSelected(initial);
                }}
                disabled={selectedProducts.length === 0 || adding !== null}
                variant="outline"
              >
                پاک کردن همه انتخاب‌ها
              </Button>
            </CardFooter>
          </Card>
        </aside>
      </div>
    </div>
  );
}
