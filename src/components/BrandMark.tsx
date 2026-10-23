import Image from "next/image";

/** Company logo (Ref/Đạt Danh_logo_2.png → public/logo-dat-danh.png). */
export function BrandMark({
  name,
  size = "md",
  priority,
}: {
  name: string;
  size?: "md" | "lg";
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo-dat-danh.png"
      alt={`${name} – Spare Parts Factory`}
      width={1000}
      height={576}
      priority={priority}
      className={size === "lg" ? "h-auto w-full max-w-md" : "h-12 w-auto lg:h-[60px]"}
    />
  );
}
