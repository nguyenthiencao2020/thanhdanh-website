import Link from "next/link";
import { Gear } from "./Gear";

type Crumb = { href?: string; label: string };

/** Dark "blueprint" banner used at the top of inner pages. */
export function PageHeader({ title, description, crumbs }: { title: string; description?: string | null; crumbs: Crumb[] }) {
  return (
    <section className="relative isolate overflow-hidden bg-steel-900 text-white">
      <div className="bg-blueprint absolute inset-0 -z-10" />
      <div className="absolute -top-24 right-1/4 -z-10 h-72 w-72 rounded-full bg-brand-600/25 blur-3xl" />
      <Gear teeth={14} className="animate-spin-slow absolute -top-20 -right-16 -z-10 h-72 w-72 text-white/10" />
      <div className="container-page py-10 sm:py-14">
        <nav className="text-sm text-steel-100/70" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-white">Trang chủ</Link>
          {crumbs.map((c) => (
            <span key={c.label}>
              {" / "}
              {c.href ? <Link href={c.href} className="hover:text-white">{c.label}</Link> : <span className="text-white">{c.label}</span>}
            </span>
          ))}
        </nav>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 max-w-3xl text-steel-100/85">{description}</p>}
      </div>
    </section>
  );
}
