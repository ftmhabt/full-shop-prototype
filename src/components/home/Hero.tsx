"use client";

import { HeroSlide } from "@prisma/client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { FallbackImage } from "../FallbackImage";
import { Button } from "../ui/button";

import { Autoplay, Pagination } from "swiper/modules";

function Hero({ heroSlides }: { heroSlides: HeroSlide[] }) {
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
        {heroSlides.map((s) => (
          <SwiperSlide key={s.id}>
            <div className="relative h-[260px] sm:h-[360px] md:h-[420px] w-full">
              <FallbackImage
                src={s.image}
                alt={s.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute right-6 top-6 max-w-xl text-right text-white drop-shadow">
                <h2 className="text-2xl font-extrabold sm:text-3xl md:text-4xl">
                  {s.title}
                </h2>
                <p className="mt-2 text-sm opacity-90">{s.subtitle}</p>
                <div className="mt-4 flex items-center gap-3">
                  {s.primaryButtonLabel && s.primaryButtonUrl && (
                    <Button
                      asChild
                      size="sm"
                      variant="secondary"
                      className="rounded-full"
                    >
                      <a href={s.primaryButtonUrl}>{s.primaryButtonLabel}</a>
                    </Button>
                  )}
                  {s.secondaryButtonLabel && s.secondaryButtonUrl && (
                    <Button asChild size="sm" className="rounded-full">
                      <a href={s.secondaryButtonUrl}>
                        {s.secondaryButtonLabel}
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default Hero;
