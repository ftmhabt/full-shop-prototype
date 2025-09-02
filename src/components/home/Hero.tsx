"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FallbackImage } from "@/componets/FallbackImage";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

function Hero({
  heroSlides,
}: {
  heroSlides: { id: number; image: string; title: string; subtitle: string }[];
}) {
  return (
    <section className="relative w-full">
      <Carousel opts={{ align: "start" }}>
        <CarouselContent>
          {heroSlides.map((s) => (
            <CarouselItem key={s.id}>
              <Card className="overflow-hidden rounded-3xl border-0 bg-gradient-to-br from-violet-600/10 to-indigo-600/10 p-0">
                <div className="relative h-[260px] w-full sm:h-[360px] md:h-[420px]">
                  <FallbackImage
                    src={s.image}
                    alt={s.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute right-6 top-6 max-w-xl text-right text-white drop-shadow">
                    <motion.h1
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl font-extrabold sm:text-3xl md:text-4xl"
                    >
                      {s.title}
                    </motion.h1>
                    <p className="mt-2 text-sm opacity-90">{s.subtitle}</p>
                    <div className="mt-4 flex items-center gap-3">
                      <Button
                        asChild
                        size="sm"
                        variant="secondary"
                        className="rounded-full"
                      >
                        <Link href="#">مشاهده پیشنهادها</Link>
                      </Button>
                      <Button asChild size="sm" className="rounded-full">
                        <Link href="#">خرید کنید</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}

export default Hero;
