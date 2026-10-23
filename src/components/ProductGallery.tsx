"use client";

import { useState } from "react";
import { Icon } from "./Icon";

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-3xl border border-slate-200 bg-gradient-to-br from-steel-50 to-cream text-steel-500">
        <Icon name="box" className="h-16 w-16" />
      </div>
    );
  }
  return (
    <div>
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[active]} alt={alt} className="aspect-[4/3] w-full object-contain" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ảnh ${i + 1}`}
              className={`overflow-hidden rounded-xl border-2 bg-white transition ${i === active ? "border-brand-600" : "border-slate-200 hover:border-steel-500"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="aspect-square w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
