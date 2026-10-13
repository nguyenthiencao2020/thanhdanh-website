import type { Metadata } from "next";
import Image from "next/image";
import { signIn } from "../actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Đăng nhập quản trị", robots: { index: false } };

type SearchParams = Promise<{ error?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const { error } = await searchParams;
  const message = error === "forbidden" ? "Tài khoản này chưa được cấp quyền quản trị." : error;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <Image src="/logo.png" alt="Logo" width={1200} height={593} className="mx-auto h-16 w-auto" />
        <h1 className="mt-6 text-center text-lg font-bold text-slate-900">Đăng nhập quản trị</h1>

        {!isSupabaseConfigured ? (
          <p className="mt-6 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
            Chưa cấu hình Supabase. Thêm <code>NEXT_PUBLIC_SUPABASE_URL</code> và <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> vào
            biến môi trường (xem README).
          </p>
        ) : (
          <form action={signIn} className="mt-6 space-y-4">
            {message && <p className="rounded-md bg-brand-50 p-3 text-sm text-brand-700">{message}</p>}
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required autoComplete="username" className="input" />
            </div>
            <div>
              <label className="label" htmlFor="password">Mật khẩu</label>
              <input id="password" name="password" type="password" required autoComplete="current-password" className="input" />
            </div>
            <button type="submit" className="btn-primary w-full">Đăng nhập</button>
          </form>
        )}
      </div>
    </div>
  );
}
