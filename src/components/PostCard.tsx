import Link from "next/link";
import type { Post } from "@/lib/types";
import { Icon } from "./Icon";

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Ho_Chi_Minh" }).format(new Date(iso));

export function PostCard({ post, large }: { post: Post; large?: boolean }) {
  return (
    <Link
      href={`/tin-tuc/${post.slug}`}
      className={`group flex h-full overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-steel-500 hover:shadow-xl hover:shadow-steel-900/10 ${
        large ? "flex-col lg:flex-row" : "flex-col"
      }`}
    >
      <div className={`relative overflow-hidden bg-slate-100 ${large ? "aspect-[16/10] lg:aspect-auto lg:w-3/5" : "aspect-[16/10]"}`}>
        {post.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover_url} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-steel-500"><Icon name="mail" className="h-10 w-10" /></div>
        )}
        {post.category && (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-steel-700 shadow-sm backdrop-blur">
            {post.category}
          </span>
        )}
      </div>
      <div className={`flex flex-1 flex-col ${large ? "p-6 lg:p-8" : "p-5"}`}>
        <p className="flex items-center gap-1.5 text-xs text-slate-500">
          <Icon name="clock" className="h-3.5 w-3.5" /> {formatDate(post.published_at)}
        </p>
        <h3 className={`mt-2 font-bold text-slate-900 group-hover:text-brand-600 ${large ? "text-2xl" : "line-clamp-2 text-lg"}`}>{post.title}</h3>
        {post.excerpt && <p className={`mt-2 text-sm text-slate-500 ${large ? "" : "line-clamp-3"}`}>{post.excerpt}</p>}
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-steel-600 transition-all group-hover:gap-2 group-hover:text-brand-600">
          Đọc tiếp <Icon name="arrow" className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
