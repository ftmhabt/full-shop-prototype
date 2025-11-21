import { Card } from "../ui/card";

export default function LoadingSkeleton() {
  return (
    <div className="flex justify-between p-3">
      {[0, 1, 2, 3].map((i) => (
        <Card key={i} className="h-40 w-1/5 bg-muted animate-pulse"></Card>
      ))}
    </div>
  );
}
