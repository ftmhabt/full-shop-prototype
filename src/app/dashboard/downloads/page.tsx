import { Button } from "@/components/ui/button";

export default function DownloadsPage() {
  const files = [
    { id: 1, name: "کتاب الکترونیکی A", link: "#" },
    { id: 2, name: "کتاب الکترونیکی B", link: "#" },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">دانلودها</h2>
      <ul className="space-y-2">
        {files.map((f) => (
          <li key={f.id} className="flex items-center justify-between">
            <span>{f.name}</span>
            <Button size="sm" asChild>
              <a href={f.link}>دانلود</a>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
