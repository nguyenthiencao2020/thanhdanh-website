import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListing } from "@/components/ProductListing";
import { getCategories } from "@/lib/data";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getCategories()).find((c) => c.slug === slug);
  if (!category) return {};
  return {
    title: category.name,
    description: category.description ?? undefined,
    openGraph: category.image_url ? { images: [category.image_url] } : undefined,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const category = (await getCategories()).find((c) => c.slug === slug);
  if (!category) notFound();
  return (
    <ProductListing
      categorySlug={slug}
      params={{ brand: one(sp["thuong-hieu"]), q: one(sp.q), sort: one(sp["sap-xep"]), page: Number(one(sp.trang)) || 1 }}
    />
  );
}
