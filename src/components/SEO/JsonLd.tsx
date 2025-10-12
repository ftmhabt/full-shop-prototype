"use client";

interface JsonLdProps {
  data: Record<string, any>;
}

/**
 * A reusable component for injecting any JSON-LD schema
 */
export default function JsonLd({ data }: JsonLdProps) {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
