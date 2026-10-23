import type { Metadata } from "next";
import Link from "next/link";
import { signOut } from "../actions";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = { title: "Quản trị", robots: { index: false } };
export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/yeu-cau", label: "Yêu cầu báo giá" },
  { href: "/admin/san-pham", label: "Sản phẩm" },
  { href: "/admin/danh-muc", label: "Danh mục" },
  { href: "/admin/thuong-hieu", label: "Thương hiệu" },
  { href: "/admin/tin-tuc", label: "Tin tức" },
  { href: "/admin/dich-vu", label: "Dịch vụ" },
  { href: "/admin/trang", label: "Trang chính sách" },
  { href: "/admin/cai-dat", label: "Cài đặt" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();
  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <aside className="bg-steel-900 text-steel-100 lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:shrink-0">
        <div className="flex items-center justify-between p-4 lg:block">
          <Link href="/admin" className="font-bold text-white">Quản trị website</Link>
          <Link href="/" target="_blank" className="text-xs text-steel-100/70 hover:text-white lg:mt-1 lg:block">
            Xem website ↗
          </Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 lg:block lg:space-y-1 lg:overflow-visible">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="block shrink-0 rounded-md px-3 py-2 text-sm whitespace-nowrap hover:bg-white/10 hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden border-t border-white/10 p-4 text-xs lg:absolute lg:bottom-0 lg:block lg:w-full">
          <p className="truncate">{user.email}</p>
          <form action={signOut}>
            <button className="mt-2 text-white hover:underline">Đăng xuất</button>
          </form>
        </div>
      </aside>
      <div className="flex-1 p-4 sm:p-8">
        {children}
        <form action={signOut} className="mt-10 lg:hidden">
          <button className="text-sm text-slate-500 hover:underline">Đăng xuất ({user.email})</button>
        </form>
      </div>
    </div>
  );
}
