"use server";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { sendInquiryMail } from "@/lib/mail";
import { createPublicClient } from "@/lib/supabase/server";

export type QuoteState = { ok: boolean; message: string } | null;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const PHOTO_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const MAX_PHOTOS = 3;
const MAX_PHOTO_BYTES = 3 * 1024 * 1024;

/** Missing column / table (migration not run yet). */
const isMissingSchema = (error: { code?: string } | null) =>
  Boolean(error && ["42P01", "42703", "PGRST205", "PGRST204"].includes(error.code ?? ""));

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

  // Nameplate photos (already shrunk in the browser). Private bucket `yeu-cau`, migration 0012.
  const photos = form
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0)
    .slice(0, MAX_PHOTOS);
  if (photos.some((f) => !PHOTO_TYPES[f.type])) return { ok: false, message: "Chỉ nhận ảnh JPG, PNG hoặc WEBP." };
  if (photos.some((f) => f.size > MAX_PHOTO_BYTES)) return { ok: false, message: "Ảnh quá lớn (tối đa 3 MB mỗi ảnh)." };

  const page = field(form, "page", 300);
  const photoData = await Promise.all(photos.map(async (p, i) => ({ filename: `tem-nhan-${i + 1}.${PHOTO_TYPES[p.type]}`, content: await p.arrayBuffer() })));

  const supabase = createPublicClient({ cache: false });
  const month = new Date().toISOString().slice(0, 7);
  const attachments: string[] = [];
  for (const photo of photos) {
    const path = `inbox/${month}/${crypto.randomUUID()}.${PHOTO_TYPES[photo.type]}`;
    const { error } = await supabase.storage.from("yeu-cau").upload(path, photoData[photos.indexOf(photo)].content, { contentType: photo.type, upsert: false });
    if (error) console.error("submitInquiry upload", error.message);
    else attachments.push(path);
  }
  const lost = photos.length - attachments.length;
  const note = (n: number) => `\n\n[Khách có gửi ${n} ảnh tem nhãn nhưng hệ thống chưa lưu được — liên hệ khách xin ảnh qua Zalo]`;
  const row = { name, phone, email, company, product_id: productId && UUID.test(productId) ? productId : null };

  let { error } = await supabase
    .from("inquiries")
    .insert({ ...row, message: lost ? `${message ?? ""}${note(lost)}`.slice(0, 4000) : message, attachments });
  // Before migration 0012 there is no `attachments` column: keep the text, note the photos.
  if (error && isMissingSchema(error)) {
    ({ error } = await supabase
      .from("inquiries")
      .insert({ ...row, message: photos.length ? `${message ?? ""}${note(photos.length)}`.slice(0, 4000) : message }));
  }

  if (error) {
    console.error("submitInquiry", error.message);
    return { ok: false, message: "Không gửi được yêu cầu. Vui lòng thử lại hoặc gọi hotline." };
  }
  await sendInquiryMail({ name, phone, email, company, message, page, photos: photoData });
  return { ok: true, message: "Cảm ơn bạn! Chúng tôi đã nhận yêu cầu và sẽ liên hệ lại sớm." };
}
