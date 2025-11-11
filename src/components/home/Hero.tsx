"use client";

import { HeroSlide as HeroSlideType } from "@prisma/client";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { HeroSlideItem } from "./HeroSlideItem";

import "swiper/css";
import "swiper/css/pagination";

interface HeroProps {
  heroSlides: HeroSlideType[];
}

export default function Hero({ heroSlides }: HeroProps) {
  return (
    <section className="relative w-full">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        pagination={{ clickable: true }}
        loop
        autoplay={{ delay: 5000 }}
        className="rounded-xl"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <HeroSlideItem slide={slide} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
