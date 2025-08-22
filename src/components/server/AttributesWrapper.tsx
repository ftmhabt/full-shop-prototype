import { getAttributesByCategorySlug } from "@/app/actions/products";
import FiltersForm from "../../componets/FiltersForm";

interface AttributesWrapperProps {
  slug: string;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function AttributesWrapper({
  slug,
  searchParams,
}: AttributesWrapperProps) {
  const attributes = await getAttributesByCategorySlug(slug);

  return (
    <FiltersForm
      slug={slug}
      attributes={attributes}
      searchParams={searchParams}
    />
  );
}
