"use client";

import { useRouter } from "next/navigation";
import { useCatalogNav } from "./CatalogNav";

/** Brand filter as a dropdown; navigates to the listing URL built server-side for each option. */
export function BrandSelect({ options, value }: { options: { label: string; value: string; href: string }[]; value: string }) {
  const router = useRouter();
  const nav = useCatalogNav();
  return (
    <select
      aria-label="Lọc theo thương hiệu"
      className="input h-11 rounded-xl"
      value={value}
      onChange={(e) => {
        const o = options.find((x) => x.value === e.target.value);
        if (o) (nav ? nav.go(o.href) : router.push(o.href));
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
