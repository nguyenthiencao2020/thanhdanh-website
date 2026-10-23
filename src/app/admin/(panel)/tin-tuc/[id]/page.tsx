import { notFound } from "next/navigation";
import { Flash } from "@/components/admin/Flash";
import { PostForm } from "@/components/admin/PostForm";
import { requireAdmin } from "@/lib/admin";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> };

export default async function EditPost({ params, searchParams }: Props) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const { supabase } = await requireAdmin();
  const { data: post } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  if (!post) notFound();
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Sửa bài viết</h1>
      <Flash error={error} />
      <PostForm post={post} />
    </>
  );
}
