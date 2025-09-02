function Price({ value, old }: { value: number; old?: number | null }) {
  const format = (n: number) => n.toLocaleString("fa-IR");
  return (
    <div className="flex items-center gap-2">
      {old ? (
        <span className="text-muted-foreground line-through text-sm">
          {format(old)} تومان
        </span>
      ) : null}
      <span className="font-bold">{format(value)} تومان</span>
    </div>
  );
}

export default Price;
