"use client";
import { deleteBrand } from "@/app/actions/brand";
import { Brand } from "@prisma/client";
import { useState, useTransition } from "react";
import BrandTableRow from "../admin/brand/BrandTableRow";
import EditBrandForm from "../admin/brand/EditBrandForm";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function Brands({ brands }: { brands: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [isAdding, setIsAdding] = useState(false);
  const [selected, setSelected] = useState<Brand | null>(null);

  const handleDelete = (id: string) => {
    startTransition(() => deleteBrand(id));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">برندها</h1>
        <Button onClick={() => setIsAdding(true)} className="mb-4">
          ایجاد برند جدید
        </Button>
      </div>

      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead className="text-right">تصویر</TableHead>
              <TableHead className="text-right">فعال</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand) => (
              <BrandTableRow
                key={brand.id}
                brand={brand}
                onDelete={handleDelete}
                onEdit={() => setSelected(brand)}
              />
            ))}
          </TableBody>
        </Table>
        {selected && (
          <EditBrandForm
            brand={{
              ...selected,
              name: selected.name ?? undefined,
              slug: selected.slug ?? undefined,
              imageFile: selected.logo ?? undefined,
            }}
            open={!!selected}
            onClose={() => setSelected(null)}
          />
        )}
        {/* Create New Slide Form */}
        {isAdding && (
          <EditBrandForm
            brand={{
              name: "",
              slug: "",
              imageFile: "",
            }}
            open={isAdding}
            onClose={() => setIsAdding(false)}
            isNew
          />
        )}
      </Card>
    </div>
  );
}
