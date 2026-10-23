import { Flash } from "@/components/admin/Flash";
import { PostForm } from "@/components/admin/PostForm";
import { requireAdmin } from "@/lib/admin";

export default async function NewPost({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  await requireAdmin();
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Viết bài mới</h1>
      <Flash error={error} />
      <PostForm />
    </>
  );
}
