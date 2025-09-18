import { persianNumber } from "@/lib/format";

export default function Rating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= value ? "text-yellow-500" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-sm text-muted-foreground">
        ({persianNumber(value)} از ۵)
      </span>
    </div>
  );
}
