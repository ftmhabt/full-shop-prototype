import { FallbackImage } from "@/components/FallbackImage";
import { Card, CardContent } from "@/components/ui/card";
import { BRANDS } from "@/constants/home";

export default function BrandStrip() {
  return (
    <section className="mt-12">
      <Card className="rounded-3xl">
        <CardContent className="flex flex-wrap items-center justify-center gap-8 p-6">
          {BRANDS.map((brand) => (
            <div
              key={brand}
              className="opacity-70 transition-opacity hover:opacity-100"
            >
              <FallbackImage
                src={`/images/brands/${brand}.png`}
                alt={brand}
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
