"use client";

import { StandardizedProduct } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "./ProductCard";

import "swiper/css";

interface ProductsProps {
  products: StandardizedProduct[];
}

export default function ProductSlider({ products }: ProductsProps) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <Swiper
      modules={[Navigation]}
      spaceBetween={20}
      loop={true}
      slidesOffsetBefore={40}
      slidesOffsetAfter={40}
      dir="rtl"
      onBeforeInit={(swiper) => {
        if (
          swiper.params.navigation &&
          typeof swiper.params.navigation !== "boolean"
        ) {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }
      }}
      breakpoints={{
        0: { slidesPerView: 1 },
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
      }}
      className="px-12"
    >
      {products.map((p) => (
        <SwiperSlide key={p.id}>
          <div className="p-2">
            <ProductCard p={p} />
          </div>
        </SwiperSlide>
      ))}

      {/* Custom arrows */}
      <button
        ref={prevRef}
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md sm:block"
      >
        <ChevronLeft className="h-5 w-5 text-gray-700" />
      </button>
      <button
        ref={nextRef}
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md sm:block"
      >
        <ChevronRight className="h-5 w-5 text-gray-700" />
      </button>
    </Swiper>
  );
}
