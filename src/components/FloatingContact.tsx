import { phoneDigits } from "@/lib/utils";
import { Icon } from "./Icon";

/** Sticky call / Zalo / Messenger buttons — the main conversion path for B2B visitors on mobile. */
export function FloatingContact({ phone, zalo, messenger }: { phone: string | null; zalo: string | null; messenger: string | null }) {
  if (!phone && !zalo && !messenger) return null;
  const base = "flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg ring-4 ring-white transition hover:scale-110";
  return (
    <div className="fixed right-4 bottom-4 z-50 hidden flex-col gap-3 lg:flex">
      {messenger && (
        <a href={messenger} target="_blank" rel="noopener noreferrer" className={`${base} bg-gradient-to-br from-[#00b2ff] to-[#a033ff]`} aria-label="Chat Messenger">
          <Icon name="chat" className="h-5 w-5" />
        </a>
      )}
      {zalo && (
        <a
          href={`https://zalo.me/${phoneDigits(zalo)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${base} bg-steel-500 text-xs font-bold`}
          aria-label="Chat Zalo"
        >
          Zalo
        </a>
      )}
      {phone && (
        <a href={`tel:${phoneDigits(phone)}`} className={`${base} relative bg-brand-600`} aria-label={`Gọi ${phone}`}>
          <span className="absolute inset-0 animate-ping rounded-full bg-brand-500/50" />
          <Icon name="phone" className="relative h-5 w-5" />
        </a>
      )}
    </div>
  );
}
