import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ProductWithAttributes } from "@/types";
import { FallbackImage } from "./FallbackImage";

export default function ProductCard({
  product,
}: {
  product: ProductWithAttributes;
}) {
  return (
    <Card className="flex flex-col gap-0 rounded-2xl shadow hover:shadow-lg transition">
      <CardHeader>
        <FallbackImage
          src={product.image}
          fallbackSrc="/fallback.png"
          alt={product.name}
          width={400}
          height={160}
          className="w-full h-40 object-contain"
        />
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-2 text-center">
        <h2 className="text-base font-semibold">{product.name}</h2>
        <p className="text-primary font-bold text-lg">
          {new Intl.NumberFormat("fa-IR").format(product.price)} تومان
        </p>
      </CardContent>

      <CardFooter>
        <Button variant="outline" className="w-10 h-10">
          +
        </Button>
      </CardFooter>
    </Card>
  );
}
