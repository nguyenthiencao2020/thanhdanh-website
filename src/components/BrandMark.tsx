import Image from "next/image";

/**
 * Company mark: gear/factory emblem + company name as live text.
 * Used instead of /logo.png, whose artwork still reads “THANH DANH”.
 */
export function BrandMark({
  name,
  subtitle,
  size = "md",
  priority,
}: {
  name: string;
  subtitle?: string | null;
  size?: "md" | "lg";
  priority?: boolean;
}) {
  const lg = size === "lg";
  return (
    <span className="flex items-center gap-2.5">
      <Image
        src="/emblem.png"
        alt=""
        width={309}
        height={400}
        priority={priority}
        className={lg ? "h-32 w-auto sm:h-40" : "h-11 w-auto lg:h-14"}
      />
      <span className="flex flex-col leading-none">
        <span
          className={`font-extrabold tracking-tight text-brand-600 uppercase ${lg ? "text-4xl sm:text-5xl" : "text-xl lg:text-2xl"}`}
        >
          {name}
        </span>
        {subtitle && (
          <span
            className={`mt-1 font-semibold tracking-wide text-steel-600 uppercase ${lg ? "text-sm sm:text-base" : "text-[10px] lg:text-xs"}`}
          >
            {subtitle}
          </span>
        )}
      </span>
    </span>
  );
}
