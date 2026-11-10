import Link from "next/link";
import { Icon } from "./Icon";

type Crumb = { href?: string; label: string };

const PROMISES = [
  { icon: "shield", title: "Hàng chính hãng" },
  { icon: "chat", title: "Tư vấn chọn mã" },
  { icon: "truck", title: "Giao hàng nhanh" },
  { icon: "cog", title: "Hỗ trợ kỹ thuật" },
];

/**
 * Banner of the product pages (/san-pham, categories, brand filter, search): factory/PLC photo,
 * "Cung cấp & Phân phối" eyebrow, headline with an accented tail, search and four promises.
 */
export function ProductHero({
  crumbs,
  lead,
  accent,
  description,
  children,
}: {
  crumbs: Crumb[];
  /** First part of the headline (white). */
  lead?: string;
  /** Highlighted part of the headline. */
  accent: string;
  description?: string | null;
  /** Search box. */
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[#06304f] text-white">
      <picture>
        <source media="(max-width: 1000px)" srcSet="/img/banner/hero-san-pham-1000.jpg" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/banner/hero-san-pham.jpg" alt="" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover object-[72%_center]" />
      </picture>
      {/* Keep the text side readable; on phones the photo sits behind a stronger tint. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#062a48]/95 via-[#062a48]/70 to-[#062a48]/10 max-lg:bg-[#062a48]/75" />

      <div className="container-page py-8 sm:py-10 lg:py-12">
        <nav className="text-xs text-white/70 sm:text-sm" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-white">Trang chủ</Link>
          {crumbs.map((c) => (
            <span key={c.label}>
              {" / "}
              {c.href ? <Link href={c.href} className="hover:text-white">{c.label}</Link> : <span className="text-white">{c.label}</span>}
            </span>
          ))}
        </nav>

        <div className="mt-5 max-w-2xl">
          <p className="flex items-center gap-3 text-base font-medium text-white/90 sm:text-lg">
            <span className="h-0.5 w-10 rounded-full bg-teal-300" /> Cung cấp &amp; Phân phối
          </p>
          <h1 className="mt-2 text-3xl leading-tight font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            {lead && <>{lead} </>}
            <span className="text-teal-300">{accent}</span>
          </h1>
          {description && <p className="mt-3 max-w-xl text-base text-white/85 sm:text-lg">{description}</p>}
          {children}
        </div>

        {/* Phones: hidden (content first). Tablets: 2 × 2. Desktop: one row with dividers. */}
        <ul className="mt-7 hidden max-w-3xl grid-cols-2 gap-x-6 gap-y-3 sm:grid lg:flex lg:flex-wrap lg:items-center lg:gap-0">
          {PROMISES.map((p, i) => (
            <li key={p.title} className={`flex items-center gap-2.5 text-sm font-medium text-white/90 ${i ? "lg:border-l lg:border-white/30 lg:pl-5" : ""} lg:pr-5`}>
              <Icon name={p.icon} className="h-6 w-6 shrink-0 text-teal-300 sm:h-7 sm:w-7" />
              {p.title}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
