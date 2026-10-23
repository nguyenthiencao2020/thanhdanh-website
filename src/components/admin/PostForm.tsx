import Link from "next/link";
import { savePost } from "@/app/admin/actions";
import type { Post } from "@/lib/types";

export function PostForm({ post }: { post?: Post }) {
  const date = post?.published_at ? post.published_at.slice(0, 10) : new Date().toISOString().slice(0, 10);
  return (
    <form action={savePost} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {post && <input type="hidden" name="id" value={post.id} />}
      <input type="hidden" name="cover_url" value={post?.cover_url ?? ""} />

      <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div>
          <label className="label" htmlFor="title">Tiêu đề *</label>
          <input id="title" name="title" required defaultValue={post?.title} className="input" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="slug">Đường dẫn (slug)</label>
            <input id="slug" name="slug" defaultValue={post?.slug} placeholder="Tự tạo từ tiêu đề" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="category">Danh mục tin</label>
            <input id="category" name="category" list="post-categories" defaultValue={post?.category ?? ""} placeholder="VD: Hướng dẫn kỹ thuật" className="input" />
            <datalist id="post-categories">
              <option value="Tin công ty" />
              <option value="Tin ngành" />
              <option value="Hướng dẫn kỹ thuật" />
            </datalist>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="excerpt">Tóm tắt</label>
          <textarea id="excerpt" name="excerpt" rows={2} defaultValue={post?.excerpt ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="content">Nội dung</label>
          <textarea id="content" name="content" rows={18} defaultValue={post?.content ?? ""} className="input" />
          <p className="mt-1 text-xs text-slate-500">
            Cách một dòng trống để tách đoạn. “## ” = tiêu đề, “### ” = tiêu đề nhỏ, “- ” = gạch đầu dòng, “1. ” = danh sách số.
          </p>
        </div>
        <div>
          <label className="label" htmlFor="tags">Thẻ (tags)</label>
          <input id="tags" name="tags" defaultValue={post?.tags?.join(", ") ?? ""} placeholder="aptomat, tủ điện" className="input" />
          <p className="mt-1 text-xs text-slate-500">Cách nhau bằng dấu phẩy.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-3 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={post?.published ?? true} /> Hiển thị trên website
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={post?.featured ?? false} /> Bài nổi bật (đầu trang Tin tức)
          </label>
          <div>
            <label className="label" htmlFor="published_at">Ngày đăng</label>
            <input id="published_at" name="published_at" type="date" defaultValue={date} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="author">Tác giả</label>
            <input id="author" name="author" defaultValue={post?.author ?? ""} className="input" />
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="label">Ảnh đại diện</p>
          {post?.cover_url && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={post.cover_url} alt="" className="mb-3 aspect-[16/10] w-full rounded border border-slate-200 object-cover" />
              <label className="mb-3 flex items-center gap-2 text-sm text-brand-700">
                <input type="checkbox" name="remove_cover" /> Xóa ảnh hiện tại
              </label>
            </>
          )}
          <input type="file" name="cover" accept="image/jpeg,image/png,image/webp" className="block w-full text-sm" />
          <p className="mt-1 text-xs text-slate-500">Tỉ lệ 16:10, tối đa 4MB.</p>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary flex-1">Lưu</button>
          <Link href="/admin/tin-tuc" className="btn-outline">Hủy</Link>
        </div>
      </div>
    </form>
  );
}
