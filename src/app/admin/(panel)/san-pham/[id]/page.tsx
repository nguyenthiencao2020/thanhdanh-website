import { notFound } from "next/navigation";
import { Flash } from "@/components/admin/Flash";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> };

export default async function EditProduct({ params, searchParams }: Props) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const { supabase } = await requireAdmin();
  const [{ data: product }, { data: categories }, { data: brands }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("brands").select("*").order("sort_order"),
  ]);
  if (!product) notFound();
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Sửa sản phẩm</h1>
      <Flash error={error} />
      <ProductForm product={product} categories={categories ?? []} brands={brands ?? []} />
    </>
  );
}
