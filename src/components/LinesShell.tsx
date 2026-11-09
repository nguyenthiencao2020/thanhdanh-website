import Form from "next/form";
import { getBrandsWithLines } from "@/lib/lines";
import { Icon } from "./Icon";
import { KeepScroll } from "./KeepScroll";
import { LineSidebar } from "./LineSidebar";
import { ProductHero } from "./ProductHero";

type Crumb = { href?: string; label: string };

/** Product pages laid out as: hero with search · left menu (brand → product lines) · content. */
export async function LinesShell({
  crumbs,
  lead,
  accent,
  description,
  brand,
  line,
  q,
  children,
}: {
  crumbs: Crumb[];
  lead?: string;
  accent: string;
  description?: string | null;
  brand?: string;
  line?: string;
  q?: string;
  children: React.ReactNode;
}) {
  const brands = await getBrandsWithLines();
  return (
    <>
      <ProductHero crumbs={crumbs} lead={lead} accent={accent} description={description}>
        <Form action="/san-pham" className="relative mt-6 max-w-2xl">
          <Icon name="search" className="pointer-events-none absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Nhập mã hàng, series hoặc tên sản phẩm…"
            aria-label="Tìm sản phẩm"
            className="h-13 w-full rounded-full border-0 bg-white pr-32 pl-13 text-slate-900 shadow-xl shadow-black/20 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-300 focus:outline-none"
          />
          <button type="submit" className="btn-primary absolute top-1/2 right-1.5 h-10 -translate-y-1/2 rounded-full px-6">Tìm kiếm</button>
        </Form>
      </ProductHero>
      <KeepScroll className="container-page py-8 lg:py-10">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-8">
          <LineSidebar brands={brands.map((b) => ({ slug: b.brand.slug, name: b.brand.name, lines: b.lines.map((l) => ({ slug: l.slug, name: l.name })) }))} brand={brand} line={line} />
          <div className="min-w-0">{children}</div>
        </div>
      </KeepScroll>
    </>
  );
}
