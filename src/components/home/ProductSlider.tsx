"use client";

import { StandardizedProduct } from "@/types";
import "keen-slider/keen-slider.min.css";
import { KeenSliderInstance, useKeenSlider } from "keen-slider/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import ProductCard from "./ProductCard";

interface ProductsProps {
  products: StandardizedProduct[];
}

export default function ProductSlider({ products }: ProductsProps) {
  // State to store slider instance
  const [slider, setSlider] = useState<KeenSliderInstance | null>(null);

  // Initialize Keen Slider
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    rtl: true,
    slides: { perView: 4, spacing: 20 },
    breakpoints: {
      "(max-width: 1024px)": { slides: { perView: 3, spacing: 20 } },
      "(max-width: 768px)": { slides: { perView: 2, spacing: 20 } },
      "(max-width: 640px)": { slides: { perView: 1, spacing: 20 } },
    },
    created: (instance) => setSlider(instance), // store instance for arrows
  });

  return (
    <div className="relative">
      {/* Slider */}
      <div ref={sliderRef} className="keen-slider">
        {products.map((p) => (
          <div key={p.id} className="keen-slider__slide p-2">
            <ProductCard p={p} />
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={() => slider?.prev()}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white p-2 shadow-md"
      >
        <ChevronLeft className="h-5 w-5 text-gray-700" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => slider?.next()}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white p-2 shadow-md"
      >
        <ChevronRight className="h-5 w-5 text-gray-700" />
      </button>
    </div>
  );
}
