"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState, useTransition, type MouseEvent, type ReactNode } from "react";

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
