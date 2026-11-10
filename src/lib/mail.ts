import { siteUrl } from "./utils";

/**
 * Email for each quote request, sent through Resend (https://resend.com) — plain HTTPS, no SDK.
 * Nothing is sent until these are set on Vercel:
 *   RESEND_API_KEY        API key from Resend
 *   INQUIRY_EMAIL_TO      who receives requests, comma-separated (e.g. "sales@thietbinhamay-dd.com")
 *   INQUIRY_EMAIL_FROM    optional sender, default "Website Đạt Danh <web@thietbinhamay-dd.com>"
 *                         (the domain must be verified in Resend)
 *   INQUIRY_AUTOREPLY     optional "1": also send the customer a short confirmation when they left an email
 */

export type InquiryMail = {
  name: string;
  phone: string;
  email: string | null;
  company: string | null;
  message: string | null;
  page: string | null;
  photos: { filename: string; content: ArrayBuffer }[];
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const API = process.env.RESEND_API_URL || "https://api.resend.com/emails";

async function send(body: Record<string, unknown>) {
  const res = await fetch(API, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

/** Never throws: the request is already saved in Admin, email is a bonus. */
export async function sendInquiryMail(q: InquiryMail) {
  const key = process.env.RESEND_API_KEY;
  const to = (process.env.INQUIRY_EMAIL_TO ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!key || !to.length) return;
  const from = process.env.INQUIRY_EMAIL_FROM || "Website Đạt Danh <web@thietbinhamay-dd.com>";
  const pageUrl = q.page && q.page.startsWith("/") ? `${siteUrl}${q.page}` : null;

  const rows: [string, string | null][] = [
    ["Họ tên", q.name],
    ["Điện thoại", q.phone],
    ["Email", q.email],
    ["Công ty", q.company],
    ["Gửi từ trang", pageUrl],
  ];
  const html = `
<div style="font-family:Arial,sans-serif;font-size:15px;color:#1e293b;max-width:640px">
  <h2 style="color:#b91c1c;margin:0 0 12px">Yêu cầu báo giá mới</h2>
  <table cellpadding="6" style="border-collapse:collapse">
    ${rows
      .filter(([, v]) => v)
      .map(([k, v]) => `<tr><td style="color:#64748b;white-space:nowrap">${k}</td><td><b>${k === "Điện thoại" ? `<a href="tel:${esc(v!.replace(/[^\d+]/g, ""))}">${esc(v!)}</a>` : k === "Gửi từ trang" ? `<a href="${esc(v!)}">${esc(v!)}</a>` : esc(v!)}</b></td></tr>`)
      .join("")}
  </table>
  ${q.message ? `<p style="margin:16px 0 4px;color:#64748b">Nội dung:</p><div style="white-space:pre-line;background:#f1f5f9;border-radius:8px;padding:12px">${esc(q.message)}</div>` : ""}
  ${q.photos.length ? `<p style="margin-top:12px">📎 ${q.photos.length} ảnh tem nhãn đính kèm.</p>` : ""}
  <p style="margin-top:20px"><a href="${siteUrl}/admin/yeu-cau" style="background:#b91c1c;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Mở Admin → Yêu cầu báo giá</a></p>
</div>`;
  const text = [
    "Yêu cầu báo giá mới",
    ...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`),
    q.message ? `\nNội dung:\n${q.message}` : "",
    q.photos.length ? `\n${q.photos.length} ảnh tem nhãn đính kèm.` : "",
    `\nAdmin: ${siteUrl}/admin/yeu-cau`,
  ].join("\n");

  try {
    await send({
      from,
      to,
      subject: `Báo giá mới: ${q.name} – ${q.phone}`,
      html,
      text,
      ...(q.email && { reply_to: q.email }),
      ...(q.photos.length && {
        attachments: q.photos.map((p) => ({ filename: p.filename, content: Buffer.from(p.content).toString("base64") })),
      }),
    });
  } catch (e) {
    console.error("sendInquiryMail", e instanceof Error ? e.message : e);
  }

  if (process.env.INQUIRY_AUTOREPLY === "1" && q.email) {
    try {
      await send({
        from,
        to: [q.email],
        reply_to: to[0],
        subject: "Đạt Danh đã nhận yêu cầu báo giá của bạn",
        text: `Chào ${q.name},\n\nĐạt Danh đã nhận yêu cầu báo giá của bạn và sẽ liên hệ lại sớm trong giờ làm việc.\n${q.message ? `\nNội dung bạn gửi:\n${q.message}\n` : ""}\nTrân trọng,\nĐạt Danh — ${siteUrl}`,
      });
    } catch (e) {
      console.error("sendInquiryMail autoreply", e instanceof Error ? e.message : e);
    }
  }
}
