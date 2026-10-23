"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

/**
 * Thin bar at the top of the window that starts the instant an internal link is clicked and
 * finishes when the new page is shown — so a click always gets visible feedback, even while the
 * server is still rendering the next page.
 */
function Bar() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname.startsWith("/api")) return;
      if (url.pathname === location.pathname && url.search === location.search) return; // same page / hash link
      clearTimeout(timer.current);
      setState("loading");
    };
    const onSubmit = (e: SubmitEvent) => {
      const f = e.target as HTMLFormElement;
      if ((f.method || "get").toLowerCase() === "get" && f.action.startsWith(location.origin)) setState("loading");
    };
    document.addEventListener("click", onClick, true);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, []);

  // The URL changed → the new page is on screen.
  useEffect(() => {
    setState((s) => (s === "loading" ? "done" : s));
    timer.current = setTimeout(() => setState("idle"), 300);
    return () => clearTimeout(timer.current);
  }, [pathname, search]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed top-0 left-0 z-[100] h-[3px] bg-brand-600 shadow-[0_0_8px] shadow-brand-500 ${
        state === "loading"
          ? "w-[80%] opacity-100 transition-[width] duration-[2500ms] ease-out"
          : state === "done"
            ? "w-full opacity-0 transition-[width,opacity] duration-300"
            : "w-0 opacity-0"
      }`}
    />
  );
}

export function NavProgress() {
  return (
    <Suspense fallback={null}>
      <Bar />
    </Suspense>
  );
}
