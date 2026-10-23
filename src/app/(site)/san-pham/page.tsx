import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProductListing } from "@/components/ProductListing";

export const metadata: Metadata = { title: "Sản phẩm" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;

  // Old links used ?danh-muc=…; categories now have their own pages.
  const category = one(sp["danh-muc"]);
  if (category) {
    const rest = new URLSearchParams();
    for (const k of ["thuong-hieu", "q", "sap-xep"]) {
      const v = one(sp[k]);
      if (v) rest.set(k, v);
    }
    const qs = rest.toString();
    redirect(`/danh-muc-san-pham/${encodeURIComponent(category)}${qs ? `?${qs}` : ""}`);
  }

  return (
    <ProductListing
      params={{ brand: one(sp["thuong-hieu"]), q: one(sp.q), sort: one(sp["sap-xep"]), page: Number(one(sp.trang)) || 1 }}
    />
  );
}
