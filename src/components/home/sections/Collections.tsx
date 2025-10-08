import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { COLLECTIONS } from "@/constants/home";
import { ChevronRight } from "lucide-react";

export default function Collections() {
  return (
    <section className="mt-10">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {COLLECTIONS.map(({ title, icon: Icon }, i) => (
          <Card key={i} className="rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">{title}</CardTitle>
              <Icon className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              {/* You can later map 4 sample products here */}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="mr-auto gap-1">
                مشاهده بیشتر <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
