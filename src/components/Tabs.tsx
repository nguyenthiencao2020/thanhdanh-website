"use client";

import { useState, type ReactNode } from "react";

export function Tabs({ tabs }: { tabs: { id: string; label: string; content: ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  if (tabs.length === 0) return null;
  return (
    <div>
      <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={active === t.id}
            onClick={() => setActive(t.id)}
            className={`-mb-px shrink-0 border-b-2 px-5 py-3 text-sm font-semibold transition ${
              active === t.id ? "border-brand-600 text-brand-600" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" hidden={active !== t.id} className="py-6">
          {t.content}
        </div>
      ))}
    </div>
  );
}
