"use client";
import Image from "next/image";

interface FallbackImageProps {
  src?: string | null | undefined;
  alt: string;
  width?: number | `${number}`;
  height?: number | `${number}`;
  fill?: boolean;
  className?: string;
  fallbackSrc?: string;
  style?: any;
  unoptimized?: any;
  priority?: boolean;
}

export function FallbackImage({ 
  src, 
  alt, 
  width, 
  height, 
  fill,
  className,
  fallbackSrc = "/fallback.png",
  priority
}: FallbackImageProps) {
  // Determine valid src - handle null, undefined, empty string, and empty object
  const getValidSrc = (): string => {
    // If src is missing, null, undefined, empty string, or not a string
    if (!src || typeof src !== 'string' || src.trim() === '') {
      return fallbackSrc;
    }
    return src;
  };
  
  const validSrc = getValidSrc();
  const isLocalImage = validSrc.startsWith('/');
  
  return (
    <Image
      src={validSrc}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      priority={priority}
      unoptimized={isLocalImage}
      onError={(e: any) => {
        if (e.target.src !== fallbackSrc) {
          e.target.src = fallbackSrc;
        }
      }}
    />
  );
}