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
  // First, last and the pages around the current one; "…" for the rest, so the bar stays on one line on phones.
  const visible: (number | null)[] = [];
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || Math.abs(p - page) <= 1) visible.push(p);
    else if (visible[visible.length - 1] !== null) visible.push(null);
  }
  const cls = "flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition";
  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Phân trang">
      {page > 1 && <Link href={href(page - 1)} className={`${cls} border-slate-200 hover:border-steel-500`}>‹<span className="sr-only sm:not-sr-only sm:ml-1">Trước</span></Link>}
      {visible.map((p, i) =>
        p === null ? (
          <span key={`gap-${i}`} className="px-1 text-slate-400" aria-hidden="true">…</span>
        ) : (
          <Link
            key={p}
            href={href(p)}
            aria-current={p === page ? "page" : undefined}
            className={`${cls} ${p === page ? "border-steel-600 bg-steel-600 text-white" : "border-slate-200 hover:border-steel-500"}`}
          >
            {p}
          </Link>
        ),
      )}
      {page < pages && <Link href={href(page + 1)} className={`${cls} border-slate-200 hover:border-steel-500`}><span className="sr-only sm:not-sr-only sm:mr-1">Sau</span>›</Link>}
    </nav>
  );
}
