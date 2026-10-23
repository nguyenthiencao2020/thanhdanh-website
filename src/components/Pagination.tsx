import Link from "next/link";

/** Page links that keep the current query string (`params`) and only change `trang`. */
export function Pagination({
  page,
  total,
  pageSize,
  basePath,
  params = {},
}: {
  page: number;
  total: number;
  pageSize: number;
  basePath: string;
  params?: Record<string, string | undefined>;
}) {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;
  const href = (p: number) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v && sp.set(k, v));
    if (p > 1) sp.set("trang", String(p));
    const s = sp.toString();
    return s ? `${basePath}?${s}` : basePath;
  };
  const cls = "flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition";
  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Phân trang">
      {page > 1 && <Link href={href(page - 1)} className={`${cls} border-slate-200 hover:border-steel-500`}>‹ Trước</Link>}
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={href(p)}
          aria-current={p === page ? "page" : undefined}
          className={`${cls} ${p === page ? "border-steel-600 bg-steel-600 text-white" : "border-slate-200 hover:border-steel-500"}`}
        >
          {p}
        </Link>
      ))}
      {page < pages && <Link href={href(page + 1)} className={`${cls} border-slate-200 hover:border-steel-500`}>Sau ›</Link>}
    </nav>
  );
}
