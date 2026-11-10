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

const STAT_ICONS = ["shield", "handshake", "diamond"];

/** Product photo tiles: frosted light-blue glass over the factory backdrop. */
const GLASS = "overflow-hidden rounded-[2rem] border border-white/70 shadow-[0_30px_60px_-25px_rgba(0,30,90,0.75)]";
/** Inner fill (not a stacking context) so the white product photos multiply into the tint. */
const GLASS_FILL = "bg-gradient-to-br from-white via-sky-50 to-sky-200";

/** Colours the end of the headline light blue, splitting after "cho", "từ", "&" or a comma when that leaves 2–5 words. */
function Title({ text }: { text: string }) {
  const words = text.trim().split(/\s+/);
  let cut = -1;
  for (let i = words.length - 2; i >= 1; i--) {
    const left = words.length - 1 - i;
    if (left < 2) continue;
    if (left > 5) break;
    if (/^(cho|từ|&|–|-)$/i.test(words[i]) || /,$/.test(words[i])) {
      cut = i + 1;
      break;
    }
  }
  if (cut < 0) cut = words.length - Math.max(2, Math.floor(words.length * 0.4));
  return (
    <>
      {words.slice(0, cut).join(" ")} <span className="text-sky-300">{words.slice(cut).join(" ")}</span>
    </>
  );
}

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
      className={`relative isolate overflow-hidden bg-[#012b5d] text-white ${boxed ? "rounded-3xl" : ""}`}
      aria-roledescription="carousel"
      aria-label="Banner"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Factory backdrop: deep blue on the left for the text, the production line on the right. */}
      <picture>
        <source media="(max-width: 900px)" srcSet="/img/banner/hero-nha-may-900.jpg" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/banner/hero-nha-may.jpg" alt="" fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover object-[70%_center]" />
      </picture>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#012b5d]/85 via-[#012b5d]/45 to-transparent lg:from-[#012b5d]/60 lg:via-transparent" />
      <Gear teeth={14} className="animate-spin-slow absolute top-1/3 -left-24 -z-10 h-64 w-64 text-white/[0.06]" />

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
                className={`grid items-center gap-10 ${boxed ? "px-6 py-12 sm:px-10 lg:py-14" : "container-page pt-14 pb-28 sm:pb-16 lg:py-14 xl:py-16 [@media(min-height:900px)]:lg:py-20"} ${
                  b.image_url ? "" : boxed ? "xl:grid-cols-[1.1fr_1fr]" : "lg:grid-cols-[1.05fr_1fr]"
                }`}
              >
                <div className={`max-w-2xl transition-all delay-150 duration-700 ${on ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
                  {tagline && (
                    <p className="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-1.5 text-sm font-semibold text-white">
                      <Icon name="bolt" className="h-4 w-4 fill-amber-400 text-amber-400" /> {tagline}
                    </p>
                  )}
                  {i === 0 ? (
                    <h1 className={`mt-5 text-4xl leading-[1.08] font-extrabold tracking-tight sm:text-5xl ${boxed ? "" : "xl:text-[3.5rem]"}`}><Title text={b.title} /></h1>
                  ) : (
                    <h2 className={`mt-5 text-4xl leading-[1.08] font-extrabold tracking-tight sm:text-5xl ${boxed ? "" : "xl:text-[3.5rem]"}`}><Title text={b.title} /></h2>
                  )}
                  <div className="mt-4 h-1 w-24 rounded-full bg-brand-600" />
                  {b.subtitle && <p className="mt-5 max-w-xl text-base leading-relaxed text-white/90 lg:text-[17px]">{b.subtitle}</p>}
                  <div className="mt-7 flex flex-wrap gap-3">
                    {b.cta_url && (
                      <Link
                        href={b.cta_url}
                        tabIndex={on ? undefined : -1}
                        className="btn-primary rounded-full py-3 pr-7 pl-3 text-base shadow-lg shadow-brand-900/40"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-brand-600">
                          <Icon name="arrow" className="h-4 w-4" />
                        </span>
                        {b.cta_label || "Xem thêm"}
                      </Link>
                    )}
                    {phone && phoneHref && (
                      <a
                        href={`tel:${phoneHref}`}
                        tabIndex={on ? undefined : -1}
                        className="btn rounded-full border border-white/70 px-7 py-3 text-base text-white hover:bg-white/10"
                      >
                        <Icon name="phone" className="h-4 w-4" /> {phone}
                      </a>
                    )}
                  </div>
                  <div className="mt-8 hidden max-w-xl grid-cols-3 sm:grid">
                    {stats.map((st, k) => (
                      <div key={st.label} className={`flex items-center gap-2.5 xl:gap-3 ${k ? "border-l border-white/40 pl-4 xl:pl-7" : ""}`}>
                        <Icon name={STAT_ICONS[k] ?? "check"} className="h-7 w-7 shrink-0 text-white/90 xl:h-8 xl:w-8" />
                        <div className="flex flex-col-reverse">
                          <p className="text-xs whitespace-nowrap text-white/80 xl:text-sm">{st.label}</p>
                          <p className="text-2xl font-extrabold whitespace-nowrap text-white sm:text-3xl">{st.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {!b.image_url && collage.length > 0 && (
                  <div
                    className={`relative mx-auto h-[300px] w-full max-w-[540px] lg:mr-0 transition-all delay-300 duration-700 ${boxed ? "hidden sm:h-[380px] xl:block" : "hidden lg:block lg:h-[400px] xl:h-[430px]"} ${
                      on ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
                    }`}
                  >
                    <div className={`animate-float absolute top-[14%] left-0 w-[62%] ${GLASS}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <div className={GLASS_FILL}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={collage[0]} alt="" className="aspect-[4/3] w-full object-contain p-4 mix-blend-multiply" />
                      </div>
                    </div>
                    {collage[1] && (
                      <div
                        className={`animate-float absolute top-0 right-2 hidden w-[40%] sm:block ${GLASS}`}
                        style={{ animationDelay: "-2s" }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <div className={GLASS_FILL}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={collage[1]} alt="" className="aspect-[4/3] w-full object-contain p-3 mix-blend-multiply" />
                      </div>
                      </div>
                    )}
                    {collage[2] && (
                      <div
                        className={`animate-float absolute right-6 bottom-0 w-[42%] ${GLASS}`}
                        style={{ animationDelay: "-4s" }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <div className={GLASS_FILL}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={collage[2]} alt="" className="aspect-[4/3] w-full object-contain p-3 mix-blend-multiply" />
                      </div>
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
          <div className="absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 sm:bottom-14">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Slide ${i + 1}`}
                aria-current={i === active}
                className="group/dot flex h-11 min-w-11 items-center justify-center px-1"
              >
                <span className={`block h-2.5 rounded-full transition-all ${i === active ? "w-8 bg-brand-600" : "w-2.5 bg-white/40 group-hover/dot:bg-white/70"}`} />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label="Slide trước"
            className="absolute top-1/2 left-4 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 backdrop-blur transition hover:bg-white/30 2xl:flex"
          >
            <Icon name="arrow" className="h-5 w-5 rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label="Slide sau"
            className="absolute top-1/2 right-4 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 backdrop-blur transition hover:bg-white/30 2xl:flex"
          >
            <Icon name="arrow" className="h-5 w-5" />
          </button>
        </>
      )}
    </section>
  );
}
