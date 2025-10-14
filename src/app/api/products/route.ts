import { getProductsByCategorySlug } from "@/app/actions/products";
import { usdToToman } from "@/lib/exchange";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const params = url.searchParams;

    const slug = params.get("slug");
    if (!slug)
      return NextResponse.json({ error: "slug required" }, { status: 400 });

    const cursor = params.get("cursor") ?? undefined;
    const take = params.get("take") ? Number(params.get("take")) : 12;
    const orderBy = params.get("orderBy") ?? undefined;

    // Build filters: everything except slug, cursor, take, orderBy
    const filters: Record<string, string[]> = {};
    for (const [k, v] of params.entries()) {
      if (["slug", "cursor", "take", "orderBy"].includes(k)) continue;
      if (!filters[k]) filters[k] = [];
      filters[k].push(v);
    }

    // include orderBy in filters so your business logic (if expecting) can read it
    if (orderBy) filters.orderBy = [orderBy];

    const products = await getProductsByCategorySlug(
      slug,
      filters,
      take,
      cursor
    );

    // standardize: price numbers and priceToman
    const standardized = await Promise.all(
      products.map(async (p) => ({
        ...p,
        price: (p.price as any).toNumber
          ? (p.price as any).toNumber()
          : Number(p.price),
        oldPrice: p.oldPrice
          ? (p.oldPrice as any).toNumber?.() ?? Number(p.oldPrice)
          : null,
        priceToman: await usdToToman(
          (p.price as any).toNumber
            ? (p.price as any).toNumber()
            : Number(p.price)
        ),
        oldPriceToman: p.oldPrice
          ? await usdToToman(
              (p.oldPrice as any).toNumber
                ? (p.oldPrice as any).toNumber()
                : Number(p.oldPrice)
            )
          : null,
      }))
    );

    return NextResponse.json(standardized);
  } catch (err) {
    console.error("API /api/products error:", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
