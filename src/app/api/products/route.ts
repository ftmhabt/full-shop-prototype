import { getProductsByCategorySlug } from "@/app/actions/products";
import { usdToToman } from "@/lib/exchange";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const params = url.searchParams;

    const slug = params.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "slug required" }, { status: 400 });
    }

    const cursor = params.get("cursor") ?? undefined;
    const take = params.has("take") ? Number(params.get("take")) : 12;
    const orderBy = params.get("orderBy") ?? undefined;
    const page = params.has("page") ? Number(params.get("page")) : 1;

    // Build filters (exclude known params)
    const filters: Record<string, string[]> = {};
    for (const [key, value] of params.entries()) {
      if (["slug", "cursor", "take", "orderBy", "page"].includes(key)) continue;
      if (!filters[key]) filters[key] = [];
      filters[key].push(value);
    }

    // Include orderBy in filters (since your action reads it)
    if (orderBy) {
      filters.orderBy = [orderBy];
    }

    // Fetch products using cursor or page
    const products = await getProductsByCategorySlug(
      slug,
      filters,
      take,
      cursor,
      page
    );

    // Normalize price fields
    const standardized = await Promise.all(
      products.map(async (p) => {
        const priceNum =
          typeof p.price === "object" && "toNumber" in p.price
            ? p.price.toNumber()
            : Number(p.price);

        const oldPriceNum =
          p.oldPrice &&
          typeof p.oldPrice === "object" &&
          "toNumber" in p.oldPrice
            ? p.oldPrice.toNumber()
            : p.oldPrice
            ? Number(p.oldPrice)
            : null;

        const priceToman = await usdToToman(priceNum);
        const oldPriceToman = oldPriceNum
          ? await usdToToman(oldPriceNum)
          : null;

        return {
          ...p,
          price: priceNum,
          oldPrice: oldPriceNum,
          priceToman,
          oldPriceToman,
        };
      })
    );

    return NextResponse.json(standardized);
  } catch (err) {
    console.error("API /api/products error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
