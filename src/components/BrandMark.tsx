import Image from "next/image";

const LOGOS = {
  // Ref/Logo_Dat Danh _final_ngang_3.png — header
  horizontal: { src: "/logo-dat-danh-ngang-3.png", width: 1071, height: 240, className: "h-11 w-auto sm:h-12 lg:h-14 xl:h-16" },
  // Ref/Logo_Dat Danh _final_3.png — footer, about, login
  emblem: { src: "/logo-dat-danh-emblem-3.png", width: 1000, height: 636, className: "h-auto w-full max-w-md" },
};

/** Company logo: the horizontal lock-up for the header, the stacked emblem elsewhere. */
export function BrandMark({
  name,
  variant = "emblem",
  priority,
  className,
}: {
  name: string;
  variant?: keyof typeof LOGOS;
  priority?: boolean;
  /** Overrides the size classes. */
  className?: string;
}) {
  const logo = LOGOS[variant];
  return (
    <Image
      src={logo.src}
      alt={`${name} – Spare Parts Factory`}
      width={logo.width}
      height={logo.height}
      priority={priority}
      className={className ?? logo.className}
    />
  );
}
