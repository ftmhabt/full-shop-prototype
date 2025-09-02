import { ProductWithAttributes } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import ProductCard from "./ProductCard";

function HotProducts({ products }: { products: ProductWithAttributes[] }) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">داغ‌ترین های هفته گذشته</h2>
        <Tabs defaultValue="cctv" className="hidden sm:block">
          <TabsList>
            <TabsTrigger value="cctv">دوربین</TabsTrigger>
            <TabsTrigger value="alarm">دزدگیر</TabsTrigger>
            <TabsTrigger value="access">کنترل تردد</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <Carousel opts={{ align: "start" }}>
        <CarouselContent>
          {products.map((p) => (
            <CarouselItem
              key={p.id}
              className="basis-1/2 sm:basis-1/3 md:basis-1/4"
            >
              <ProductCard p={p} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />

        <CarouselNext />
      </Carousel>
    </section>
  );
}

export default HotProducts;
