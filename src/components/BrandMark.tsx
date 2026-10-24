import Image from "next/image";

const LOGOS = {
  // Ref/Đạt Danh Factory ngang.png — header
  horizontal: { src: "/logo-dat-danh-ngang.png", width: 1258, height: 200, className: "h-9 w-auto sm:h-10 xl:h-[52px]" },
  // Ref/Đạt Danh Factory Emblem.png — footer, about, login
  emblem: { src: "/logo-dat-danh-emblem.png", width: 1000, height: 680, className: "h-auto w-full max-w-md" },
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
