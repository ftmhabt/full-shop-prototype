function Price({
  value,
  old,
  size = "sm",
}: {
  value: number;
  old?: number | null;
  size?: "sm" | "lg";
}) {
  const format = (n: number) => n.toLocaleString("fa-IR");
  const fontSize = size == "sm" ? "text-sm" : "text-lg";
  return (
    <div className="flex items-center gap-2">
      {old ? (
        <span className={`text-muted-foreground line-through ${fontSize}`}>
          {format(old)} تومان
        </span>
      ) : null}
      <span className={`font-bold ${fontSize}`}>{format(value)} تومان</span>
    </div>
  );
}

export default Price;
