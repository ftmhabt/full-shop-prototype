import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import ProductCard from "./ProductCard";
export type StandardizedProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string[];
  badge: string | null;
  oldPrice: number | null; // Decimal -> number
  oldPriceToman: number | null;
  price: number; // Decimal -> number
  priceToman: number;
  rating: number | null;
  stock: number;
  soldCount: number;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;

  attributes: {
    id: string;
    value: {
      id: string;
      value: string;
      attribute: {
        id: string;
        name: string;
        slug: string;
      };
    };
  }[];

  reviews: {
    id: string;
    rating: number;
    comment: string;
    user: {
      displayName: string;
    };
  }[];

  category: {
    id: string;
    name: string;
    slug: string;
  };
};

function HotProducts({ products }: { products: StandardizedProduct[] }) {
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
