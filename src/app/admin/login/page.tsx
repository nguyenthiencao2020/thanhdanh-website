import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { BrandMark } from "@/components/BrandMark";
import { getSettings } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSessionClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Đăng nhập quản trị", robots: { index: false } };

type SearchParams = Promise<{ error?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const [{ error }, settings] = await Promise.all([searchParams, getSettings()]);
  // Already signed in as an admin → straight to the dashboard.
  if (isSupabaseConfigured && !error) {
    const supabase = await createSessionClient();
    const { data } = await supabase.auth.getUser();
    if (data.user && (await supabase.rpc("is_admin")).data) redirect("/admin");
  }
  const message =
    error === "forbidden"
      ? "Tài khoản này chưa được cấp quyền quản trị. Chạy lệnh insert into public.admins … trong Supabase → SQL Editor rồi đăng nhập lại."
      : error === "session"
        ? "Phiên đăng nhập không được lưu. Hãy bật cookie cho trang này (hoặc tắt chế độ chặn cookie) rồi thử lại."
        : undefined;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="flex justify-center">
          <BrandMark name={settings.short_name} className="h-24 w-auto" />
        </div>
        <h1 className="mt-6 text-center text-lg font-bold text-slate-900">Đăng nhập quản trị</h1>

        {!isSupabaseConfigured ? (
          <p className="mt-6 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
            Chưa cấu hình Supabase. Thêm <code>NEXT_PUBLIC_SUPABASE_URL</code> và <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> vào
            biến môi trường (xem README).
          </p>
        ) : (
          <LoginForm initialError={message} />
        )}
      </div>
    </div>
  );
}
