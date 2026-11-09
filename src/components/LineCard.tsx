import Link from "next/link";
import { Icon } from "./Icon";

/** One product line: representative photo, name, a few series, quote link. */
export function LineCard({ href, name, brandName, series, image }: { href: string; name: string; brandName?: string; series: string[]; image: string | null }) {
  return (
    <Link
      scroll={false} href={href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-steel-500 hover:shadow-xl hover:shadow-steel-900/10"
    >
      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-white">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} loading="lazy" className="h-full w-full object-contain p-3 transition duration-500 group-hover:scale-105" />
        ) : (
          <Icon name="box" className="h-12 w-12 text-steel-400" />
        )}
      </div>
      <div className="flex flex-1 flex-col border-t border-slate-100 p-3 sm:p-4">
        {brandName && <p className="text-xs font-bold tracking-wide text-steel-600 uppercase">{brandName}</p>}
        <h3 className="mt-0.5 text-sm leading-snug font-bold text-slate-900 group-hover:text-brand-600 sm:text-base">{name}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-slate-500 sm:text-sm">{series.slice(0, 5).join(" · ")}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-sm font-bold text-brand-600">
          Xem &amp; báo giá <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
