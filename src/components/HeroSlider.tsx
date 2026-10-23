"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Banner } from "@/lib/types";
import { Gear } from "./Gear";
import { Icon } from "./Icon";

type Props = {
  banners: Banner[];
  tagline: string | null;
  phone: string | null;
  phoneHref: string | null;
  stats: { value: string; label: string }[];
  /** Rounded banner that sits next to the category menu instead of spanning the page. */
  boxed?: boolean;
};

const INTERVAL = 6000;

/** Home hero: rotating slides (Admin → Banner trang chủ). Photo slides fill the banner; others show an illustration collage. */
export function HeroSlider({ banners, tagline, phone, phoneHref, stats, boxed }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = banners.length;
  const go = useCallback((i: number) => setActive(((i % count) + count) % count), [count]);

  useEffect(() => {
    if (paused || count < 2) return;
    const t = setTimeout(() => go(active + 1), INTERVAL);
    return () => clearTimeout(t);
  }, [active, paused, count, go]);

  return (
    <section
      className={`relative isolate overflow-hidden bg-steel-900 text-white ${boxed ? "rounded-3xl" : ""}`}
      aria-roledescription="carousel"
      aria-label="Banner"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="bg-blueprint absolute inset-0 -z-10" />
      <div className="absolute -top-40 -left-40 -z-10 h-[520px] w-[520px] rounded-full bg-steel-500/30 blur-3xl" />
      <div className="absolute -right-32 -bottom-48 -z-10 h-[480px] w-[480px] rounded-full bg-brand-600/30 blur-3xl" />
      <Gear teeth={14} className="animate-spin-slow absolute -top-24 -right-24 -z-10 h-96 w-96 text-white/10" />

      {/* Slides are stacked; the active one fades in. The tallest sets the height. */}
      <div className="grid">
        {banners.map((b, i) => {
          const on = i === active;
          const collage = b.collage?.length ? b.collage : [];
          return (
            <div
              key={b.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${count}`}
              aria-hidden={!on}
              className={`col-start-1 row-start-1 transition-opacity duration-700 ${on ? "z-10 opacity-100" : "pointer-events-none opacity-0"}`}
            >
              {b.image_url && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={b.image_url}
                    alt=""
                    className={`absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-[7000ms] ${on ? "scale-105" : "scale-100"}`}
                  />
                  <div className="absolute inset-0 -z-10 bg-gradient-to-r from-steel-900/95 via-steel-900/75 to-steel-900/20" />
                </>
              )}
              <div
                className={`grid items-center gap-10 ${boxed ? "px-6 py-12 sm:px-10 lg:py-14" : "container-page py-16 lg:py-24"} ${
                  b.image_url ? "" : boxed ? "xl:grid-cols-[1.1fr_1fr]" : "lg:grid-cols-[1.05fr_1fr]"
                }`}
              >
                <div className={`max-w-2xl transition-all delay-150 duration-700 ${on ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
                  {tagline && (
                    <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-steel-100 backdrop-blur">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" /> {tagline}
                    </p>
                  )}
                  {i === 0 ? (
                    <h1 className={`mt-6 text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl ${boxed ? "" : "lg:text-6xl"}`}>{b.title}</h1>
                  ) : (
                    <h2 className={`mt-6 text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-5xl ${boxed ? "" : "lg:text-6xl"}`}>{b.title}</h2>
                  )}
                  <div className="mt-4 h-1.5 w-24 rounded-full bg-gradient-to-r from-brand-500 via-orange-400 to-amber-300" />
                  {b.subtitle && <p className="mt-6 max-w-xl text-base text-steel-100/90 sm:text-lg">{b.subtitle}</p>}
                  <div className="mt-8 flex flex-wrap gap-3">
                    {b.cta_url && (
                      <Link href={b.cta_url} tabIndex={on ? undefined : -1} className="btn-primary px-6 py-3 text-base shadow-lg shadow-brand-600/30">
                        {b.cta_label || "Xem thêm"} <Icon name="arrow" className="h-4 w-4" />
                      </Link>
                    )}
                    {phone && phoneHref && (
                      <a
                        href={`tel:${phoneHref}`}
                        tabIndex={on ? undefined : -1}
                        className="btn border border-white/25 bg-white/10 px-6 py-3 text-base text-white backdrop-blur hover:bg-white/20"
                      >
                        <Icon name="phone" className="h-4 w-4" /> {phone}
                      </a>
                    )}
                  </div>
                  <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-6">
                    {stats.map((s) => (
                      <div key={s.label} className="flex flex-col-reverse">
                        <dt className="mt-1 text-xs text-steel-100/70 sm:text-sm">{s.label}</dt>
                        <dd className="text-2xl font-extrabold whitespace-nowrap text-white sm:text-3xl">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {!b.image_url && collage.length > 0 && (
                  <div
                    className={`relative mx-auto h-[300px] w-full max-w-[560px] transition-all delay-300 duration-700 ${boxed ? "hidden sm:h-[380px] xl:block" : "sm:h-[440px]"} ${
                      on ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
                    }`}
                  >
                    <div className="animate-float absolute top-6 left-0 w-[72%] overflow-hidden rounded-3xl border border-white/15 bg-white shadow-2xl shadow-black/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={collage[0]} alt="" className="aspect-[4/3] w-full object-cover" />
                    </div>
                    {collage[1] && (
                      <div
                        className="animate-float absolute top-0 right-0 hidden w-[42%] overflow-hidden rounded-2xl border border-white/15 bg-white shadow-2xl shadow-black/40 sm:block"
                        style={{ animationDelay: "-2s" }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={collage[1]} alt="" className="aspect-[4/3] w-full object-cover" />
                      </div>
                    )}
                    {collage[2] && (
                      <div
                        className="animate-float absolute right-2 bottom-0 w-[50%] overflow-hidden rounded-2xl border border-white/15 bg-white shadow-2xl shadow-black/40"
                        style={{ animationDelay: "-4s" }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={collage[2]} alt="" className="aspect-[4/3] w-full object-cover" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <>
          <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Slide ${i + 1}`}
                aria-current={i === active}
                className={`h-2.5 rounded-full transition-all ${i === active ? "w-8 bg-brand-500" : "w-2.5 bg-white/40 hover:bg-white/70"}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label="Slide trước"
            className="absolute top-1/2 left-3 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur transition hover:bg-white/25 xl:flex"
          >
            <Icon name="arrow" className="h-5 w-5 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label="Slide sau"
            className="absolute top-1/2 right-3 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur transition hover:bg-white/25 xl:flex"
          >
            <Icon name="arrow" className="h-5 w-5" />
          </button>
        </>
      )}
    </section>
  );
}
