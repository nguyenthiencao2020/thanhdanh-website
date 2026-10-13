import { Flash } from "@/components/admin/Flash";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin";

export default async function NewProduct({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const { supabase } = await requireAdmin();
  const [{ data: categories }, { data: brands }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("brands").select("*").order("sort_order"),
  ]);
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Thêm sản phẩm</h1>
      <Flash error={error} />
      <ProductForm categories={categories ?? []} brands={brands ?? []} />
    </>
  );
}
