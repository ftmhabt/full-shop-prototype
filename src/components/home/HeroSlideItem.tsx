import { HeroSlide } from "@prisma/client";
import Link from "next/link";
import { FallbackImage } from "../FallbackImage";
import { Button } from "../ui/button";

interface HeroSlideItemProps {
  slide: HeroSlide;
}

export function HeroSlideItem({ slide }: HeroSlideItemProps) {
  const {
    image,
    title,
    subtitle,
    url,
    primaryButtonLabel,
    primaryButtonUrl,
    secondaryButtonLabel,
    secondaryButtonUrl,
  } = slide;

  return (
    <Link href={url || "#"} className="block">
      <div className="relative aspect-[21/9] w-full">
        <FallbackImage
          src={image}
          alt={title || ""}
          fill
          className="object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Text overlay */}
        <div className="absolute right-6 top-6 max-w-xl text-right text-white drop-shadow-md">
          {title && (
            <h2 className="text-2xl font-extrabold sm:text-3xl md:text-4xl">
              {title}
            </h2>
          )}
          {subtitle && <p className="mt-2 text-sm opacity-90">{subtitle}</p>}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {primaryButtonLabel && primaryButtonUrl && (
              <Button
                asChild
                size="sm"
                variant="secondary"
                className="rounded-full"
              >
                <Link href={primaryButtonUrl}>{primaryButtonLabel}</Link>
              </Button>
            )}
            {secondaryButtonLabel && secondaryButtonUrl && (
              <Button asChild size="sm" className="rounded-full">
                <Link href={secondaryButtonUrl}>{secondaryButtonLabel}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
