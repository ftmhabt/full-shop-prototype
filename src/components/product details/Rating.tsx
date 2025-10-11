import { persianNumber } from "@/lib/format";

export default function Rating({ value }: { value: number }) {
  return (
    <div
      className="flex items-center gap-2"
      aria-label={`امتیاز ${value} از ۵`}
    >
      <div className="flex" role="img" aria-label={`Rating: ${value} out of 5`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            aria-hidden={star > value}
            className={`text-lg ${
              star <= value ? "text-yellow-500" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        (<span itemProp="ratingValue">{persianNumber(value)}</span> از{" "}
        <span itemProp="bestRating">۵</span>)
      </span>
      {/* Structured data for SEO */}
      <meta itemProp="worstRating" content="1" />
      <meta itemProp="ratingValue" content={value.toString()} />
      <meta itemProp="bestRating" content="5" />
    </div>
  );
}
