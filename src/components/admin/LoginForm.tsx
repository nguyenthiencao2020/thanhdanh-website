"use client";

import { useActionState, useEffect } from "react";
import { signIn, type SignInState } from "@/app/admin/actions";

export function LoginForm({ initialError }: { initialError?: string }) {
  const [state, action, pending] = useActionState<SignInState, FormData>(signIn, { error: initialError });

  // Full page load so the new session cookie is sent with the request for /admin.
  useEffect(() => {
    if (state.ok) window.location.assign("/admin");
  }, [state.ok]);

  const busy = pending || state.ok;
  return (
    <form action={action} className="mt-6 space-y-4">
      {state.error && !busy && <p role="alert" className="rounded-md bg-brand-50 p-3 text-sm text-brand-700">{state.error}</p>}
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="username" className="input" />
      </div>
      <div>
        <label className="label" htmlFor="password">Mật khẩu</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="input" />
      </div>
      <button type="submit" disabled={busy} className="btn-primary w-full disabled:cursor-wait disabled:opacity-70">
        {state.ok ? "Đang mở trang quản trị…" : pending ? "Đang đăng nhập…" : "Đăng nhập"}
      </button>
    </form>
  );
}
