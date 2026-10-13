"use client";

import { useActionState } from "react";
import { submitInquiry, type QuoteState } from "@/app/actions";

type Props = { productId?: string; productName?: string; compact?: boolean };

export function QuoteForm({ productId, productName, compact }: Props) {
  const [state, action, pending] = useActionState<QuoteState, FormData>(submitInquiry, null);

  if (state?.ok) {
    return <p className="mt-4 rounded-md bg-green-50 p-4 text-sm font-medium text-green-800">{state.message}</p>;
  }

  return (
    <form action={action} className="mt-4 grid gap-4 sm:grid-cols-2">
      {productId && <input type="hidden" name="product_id" value={productId} />}
      <div className="hidden" aria-hidden="true">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div>
        <label className="label" htmlFor="q-name">Họ tên *</label>
        <input id="q-name" name="name" required maxLength={120} className="input" autoComplete="name" />
      </div>
      <div>
        <label className="label" htmlFor="q-phone">Số điện thoại *</label>
        <input id="q-phone" name="phone" type="tel" required maxLength={30} className="input" autoComplete="tel" />
      </div>
      {!compact && (
        <>
          <div>
            <label className="label" htmlFor="q-email">Email</label>
            <input id="q-email" name="email" type="email" maxLength={200} className="input" autoComplete="email" />
          </div>
          <div>
            <label className="label" htmlFor="q-company">Công ty</label>
            <input id="q-company" name="company" maxLength={200} className="input" autoComplete="organization" />
          </div>
        </>
      )}
      <div className="sm:col-span-2">
        <label className="label" htmlFor="q-message">{compact ? "Số lượng / ghi chú" : "Nội dung yêu cầu (mã hàng, số lượng…)"}</label>
        <textarea
          id="q-message"
          name="message"
          rows={compact ? 3 : 5}
          maxLength={4000}
          className="input"
          defaultValue={productName ? `Báo giá: ${productName}\nSố lượng: ` : undefined}
        />
      </div>
      {state && !state.ok && <p className="text-sm font-medium text-brand-700 sm:col-span-2">{state.message}</p>}
      <div className="sm:col-span-2">
        <button type="submit" className="btn-primary w-full sm:w-auto" disabled={pending}>
          {pending ? "Đang gửi…" : "Gửi yêu cầu báo giá"}
        </button>
      </div>
    </form>
  );
}
