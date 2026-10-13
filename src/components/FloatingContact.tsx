import { phoneDigits } from "@/lib/utils";
import { Icon } from "./Icon";

/** Sticky call / Zalo buttons — the main conversion path for B2B visitors on mobile. */
export function FloatingContact({ phone, zalo }: { phone: string | null; zalo: string | null }) {
  if (!phone && !zalo) return null;
  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-3">
      {zalo && (
        <a
          href={`https://zalo.me/${phoneDigits(zalo)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-steel-500 text-xs font-bold text-white shadow-lg ring-4 ring-white hover:bg-steel-600"
          aria-label="Chat Zalo"
        >
          Zalo
        </a>
      )}
      {phone && (
        <a
          href={`tel:${phoneDigits(phone)}`}
          className="flex h-12 w-12 animate-pulse items-center justify-center rounded-full bg-brand-600 text-white shadow-lg ring-4 ring-white hover:bg-brand-700"
          aria-label={`Gọi ${phone}`}
        >
          <Icon name="phone" className="h-5 w-5" />
        </a>
      )}
    </div>
  );
}
