"use server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/server";

export type QuoteState = { ok: boolean; message: string } | null;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const field = (form: FormData, key: string, max: number) => {
  const v = String(form.get(key) ?? "").trim();
  return v ? v.slice(0, max) : null;
};

export async function submitInquiry(_prev: QuoteState, form: FormData): Promise<QuoteState> {
  // Honeypot: real visitors never see or fill this field.
  if (field(form, "website", 200)) return { ok: true, message: "Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm." };

  const name = field(form, "name", 120);
  const phone = field(form, "phone", 30);
  const email = field(form, "email", 200);
  const company = field(form, "company", 200);
  const message = field(form, "message", 4000);
  const productId = field(form, "product_id", 36);

  if (!name) return { ok: false, message: "Vui lòng nhập họ tên." };
  if (!phone || phone.replace(/\D/g, "").length < 9) return { ok: false, message: "Vui lòng nhập số điện thoại hợp lệ." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: "Email không hợp lệ." };

  if (!isSupabaseConfigured) {
    return { ok: false, message: "Hệ thống nhận yêu cầu đang được cài đặt. Vui lòng gọi hotline để được hỗ trợ ngay." };
  }

  const { error } = await createPublicClient()
    .from("inquiries")
    .insert({ name, phone, email, company, message, product_id: productId && UUID.test(productId) ? productId : null });

  if (error) {
    console.error("submitInquiry", error.message);
    return { ok: false, message: "Không gửi được yêu cầu. Vui lòng thử lại hoặc gọi hotline." };
  }
  return { ok: true, message: "Cảm ơn bạn! Chúng tôi đã nhận yêu cầu và sẽ liên hệ lại sớm." };
}
