import Link from "next/link";
import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "Xem tất cả →",
  center,
  dark,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  center?: boolean;
  dark?: boolean;
}) {
  return (
    <Reveal className={`flex gap-4 ${center ? "flex-col items-center text-center" : "items-end justify-between"}`}>
      <div>
        <p className={`text-sm font-semibold tracking-wider uppercase ${dark ? "text-brand-100" : "text-brand-600"}`}>{eyebrow}</p>
        <h2 className={`mt-1 text-3xl font-bold sm:text-4xl ${dark ? "text-white" : "text-steel-900"}`}>{title}</h2>
        {description && <p className={`mt-2 max-w-2xl ${dark ? "text-steel-100/80" : "text-slate-500"}`}>{description}</p>}
      </div>
      {href && (
        <Link href={href} className="hidden shrink-0 text-sm font-semibold text-brand-600 hover:underline sm:block">
          {linkLabel}
        </Link>
      )}
    </Reveal>
  );
}
