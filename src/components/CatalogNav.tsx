"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState, useTransition, type MouseEvent, type ReactNode } from "react";
import { Icon } from "./Icon";

/*
 * Catalogue navigation that feels instant: links highlight the moment they are clicked, the
 * results dim with a progress bar while the next page renders, the page does not jump back to
 * the top, and hovering a link prefetches its page.
 */

type Nav = { pending: boolean; target: string | null; go: (href: string) => void; prefetch: (href: string) => void };
const NavContext = createContext<Nav | null>(null);

export function CatalogNavProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [target, setTarget] = useState<string | null>(null);
  const prefetched = useRef(new Set<string>());

  const value: Nav = {
    pending,
    target: pending ? target : null,
    go: (href) => {
      setTarget(href);
      startTransition(() => router.push(href, { scroll: false }));
    },
    prefetch: (href) => {
      if (prefetched.current.has(href)) return;
      prefetched.current.add(href);
      // "full" also prefetches the dynamic page data, so the click only has to swap it in.
      router.prefetch(href, { kind: "full" } as unknown as Parameters<typeof router.prefetch>[1]);
    },
  };
  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

/** The catalogue navigator, or null outside a <CatalogNavProvider>. */
export function useCatalogNav() {
  return useContext(NavContext);
}

function useNav() {
  const nav = useContext(NavContext);
  if (!nav) throw new Error("CatalogNav components must be inside <CatalogNavProvider>");
  return nav;
}

/** Link for the catalogue: same markup as <Link>, with optimistic highlight and hover prefetch. */
export function NavLink({
  href,
  className,
  pendingClassName,
  children,
}: {
  href: string;
  className: string;
  /** Classes used instead of `className` while this link's page is loading. */
  pendingClassName?: string;
  children: ReactNode;
}) {
  const nav = useNav();
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    nav.go(href);
  };
  return (
    <Link
      href={href}
      prefetch={false}
      onClick={onClick}
      onMouseEnter={() => nav.prefetch(href)}
      onTouchStart={() => nav.prefetch(href)}
      className={nav.target === href && pendingClassName ? pendingClassName : className}
    >
      {children}
    </Link>
  );
}

/** Wraps the results: dims them and shows a progress bar while a catalogue link is loading. */
export function CatalogResults({ children }: { children: ReactNode }) {
  const { pending } = useNav();
  const ref = useRef<HTMLDivElement>(null);
  const wasPending = useRef(false);

  // Navigation keeps the scroll position; bring the results back into view if they are above it.
  useEffect(() => {
    if (wasPending.current && !pending && ref.current) {
      const top = ref.current.getBoundingClientRect().top;
      if (top < 0) window.scrollBy({ top: top - 160, behavior: "smooth" });
    }
    wasPending.current = pending;
  }, [pending]);

  return (
    <div ref={ref} className="relative" aria-busy={pending}>
      <div className={`absolute -top-3 right-0 left-0 h-1 overflow-hidden rounded-full transition-opacity ${pending ? "opacity-100" : "opacity-0"}`}>
        <div className="animate-progress h-full w-1/3 rounded-full bg-brand-600" />
      </div>
      <div className={`transition-opacity duration-150 ${pending ? "pointer-events-none opacity-50" : ""}`}>{children}</div>
    </div>
  );
}

export type TreeGroup = { slug: string; name: string; icon: string | null; href: string; children: { slug: string; name: string; href: string }[] };

/** Category tree in the sidebar; groups expand instantly with the chevron, names navigate. */
export function CategoryTree({ groups, current, openGroup, allHref }: { groups: TreeGroup[]; current?: string; openGroup?: string; allHref: string }) {
  const [open, setOpen] = useState<Set<string>>(() => new Set(openGroup ? [openGroup] : []));
  useEffect(() => {
    if (openGroup) setOpen((s) => (s.has(openGroup) ? s : new Set(s).add(openGroup)));
  }, [openGroup]);
  const toggle = (slug: string) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(slug)) n.delete(slug);
      else n.add(slug);
      return n;
    });

  const active = "bg-brand-50 font-semibold text-brand-600";
  return (
    <ul className="space-y-0.5 text-sm">
      <li>
        <NavLink href={allHref} className={`flex items-center gap-2 rounded-lg px-2 py-2 ${!current ? active : "text-slate-700 hover:bg-slate-50"}`} pendingClassName={`flex items-center gap-2 rounded-lg px-2 py-2 ${active}`}>
          <Icon name="box" className="h-4 w-4" /> Tất cả sản phẩm
        </NavLink>
      </li>
      {groups.map((g) => {
        const isOpen = open.has(g.slug);
        const base = "flex min-w-0 flex-1 items-center gap-2 rounded-lg px-2 py-2";
        return (
          <li key={g.slug}>
            <div className="flex items-center gap-1">
              <NavLink
                href={g.href}
                className={`${base} ${current === g.slug ? active : openGroup === g.slug ? "font-semibold text-slate-900 hover:bg-slate-50" : "text-slate-700 hover:bg-slate-50"}`}
                pendingClassName={`${base} ${active}`}
              >
                <Icon name={g.icon ?? "box"} className="h-4 w-4 shrink-0" />
                <span className="flex-1">{g.name}</span>
              </NavLink>
              {g.children.length > 0 && (
                <button
                  type="button"
                  onClick={() => toggle(g.slug)}
                  aria-expanded={isOpen}
                  aria-label={`${isOpen ? "Thu gọn" : "Mở"} ${g.name}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <Icon name="arrow" className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "-rotate-90" : "rotate-90"}`} />
                </button>
              )}
            </div>
            {g.children.length > 0 && (
              <div className={`grid transition-[grid-template-rows] duration-200 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="min-h-0 overflow-hidden">
                <ul className="my-0.5 ml-4 space-y-0.5 border-l border-slate-200 pl-2">
                  {g.children.map((c) => {
                    const sub = "block rounded-lg px-2 py-1.5 text-[13px]";
                    return (
                      <li key={c.slug}>
                        <NavLink href={c.href} className={`${sub} ${current === c.slug ? active : "text-slate-600 hover:bg-slate-50"}`} pendingClassName={`${sub} ${active}`}>
                          {c.name}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
