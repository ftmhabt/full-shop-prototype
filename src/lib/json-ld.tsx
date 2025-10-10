import { BlogTag } from "@prisma/client";

export function BlogTagJSONLD(tag: BlogTag) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: tag.name,
          description: `مطالب و مقالات مرتبط با برچسب ${tag.name} در زمینه دزدگیر، دوربین مداربسته و تجهیزات امنیتی.`,
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/tag/${tag.slug}`,
        }),
      }}
    />
  );
}
