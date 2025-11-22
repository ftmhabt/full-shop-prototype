import { getBrands } from "@/app/actions/brand";
import { FallbackImage } from "@/components/FallbackImage";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default async function BrandStrip() {
  const brands = await getBrands();
  return (
    <section className="mt-12">
      <Card className="rounded-3xl">
        <CardContent className="flex flex-wrap items-center justify-center gap-8 p-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="opacity-70 transition-opacity hover:opacity-100"
            >
              <FallbackImage
                src={brand.logo!}
                alt={brand.name}
                width={96}
                height={32}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
export function BrandStripSkeleton() {
  return (
    <section className="mt-12">
      <Card className="rounded-3xl">
        <CardContent className="flex flex-wrap items-center justify-center gap-8 p-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="opacity-70 transition-opacity hover:opacity-100"
            >
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
