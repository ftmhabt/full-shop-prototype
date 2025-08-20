"use client";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

type FallbackImageProps = ImageProps & {
  fallbackSrc?: string;
};

export function FallbackImage({
  src,
  fallbackSrc = "/fallback.png",
  alt,
  ...props
}: FallbackImageProps) {
  const [error, setError] = useState(false);

  return (
    <Image
      {...props}
      src={error ? fallbackSrc : src}
      alt={alt}
      onError={() => setError(true)}
    />
  );
}
