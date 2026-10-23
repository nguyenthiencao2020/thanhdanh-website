import Link from "next/link";
import { Gear } from "@/components/Gear";
import { Icon } from "@/components/Icon";
import Form from "next/form";

export default function NotFound() {
  return (
    <div className="relative isolate flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-steel-900 px-4 py-20 text-center text-white">
      <div className="bg-blueprint absolute inset-0 -z-10" />
      <Gear teeth={14} className="animate-spin-slow absolute -top-24 -right-24 -z-10 h-96 w-96 text-white/10" />
      <p className="bg-gradient-to-r from-brand-500 via-orange-400 to-amber-300 bg-clip-text text-8xl font-extrabold text-transparent">404</p>
      <h1 className="mt-4 text-2xl font-bold">Trang không tồn tại</h1>
      <p className="mt-2 text-steel-100/80">Trang bạn tìm có thể đã bị xóa hoặc đổi địa chỉ. Thử tìm kiếm sản phẩm hoặc bài viết:</p>
      <Form action="/tim-kiem" className="relative mt-6 w-full max-w-md">
        <input name="q" type="search" placeholder="Tìm sản phẩm, bài viết…" className="input h-12 rounded-xl pr-12 text-slate-900" aria-label="Tìm kiếm" />
        <button type="submit" className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-500" aria-label="Tìm">
          <Icon name="search" className="h-5 w-5" />
        </button>
      </Form>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">Về trang chủ</Link>
        <Link href="/san-pham" className="btn border border-white/30 text-white hover:bg-white/10">Xem sản phẩm</Link>
      </div>
    </div>
  );
}
