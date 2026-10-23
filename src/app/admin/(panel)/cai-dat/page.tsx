import { saveSettings } from "../../actions";
import { Flash } from "@/components/admin/Flash";
import { requireAdmin } from "@/lib/admin";
import type { Settings } from "@/lib/types";

const fields: { name: keyof Settings; label: string; type?: "textarea"; hint?: string; required?: boolean }[] = [
  { name: "company_name", label: "Tên công ty đầy đủ", required: true },
  { name: "short_name", label: "Tên ngắn (hiển thị)", required: true },
  { name: "english_name", label: "Tên tiếng Anh" },
  { name: "tax_code", label: "Mã số thuế / Mã số doanh nghiệp" },
  { name: "license_info", label: "Thông tin đăng ký kinh doanh", hint: "VD: Đăng ký lần đầu ngày …, tại Phòng Đăng ký kinh doanh – Sở …" },
  { name: "tagline", label: "Khẩu hiệu" },
  { name: "phone", label: "Hotline 1" },
  { name: "phone2", label: "Hotline 2" },
  { name: "zalo", label: "Số Zalo" },
  { name: "email", label: "Email" },
  { name: "facebook", label: "Facebook (URL)" },
  { name: "messenger_url", label: "Link Messenger", hint: "VD: https://m.me/ten-fanpage — hiện nút Messenger nổi ở góc màn hình" },
  { name: "address", label: "Địa chỉ" },
  { name: "business_hours", label: "Giờ làm việc" },
  { name: "map_embed_url", label: "Link nhúng Google Maps", hint: "Google Maps → Chia sẻ → Nhúng bản đồ → copy giá trị src=\"…\"" },
  { name: "about", label: "Giới thiệu công ty", type: "textarea" },
  { name: "mission", label: "Sứ mệnh (trang Giới thiệu)", type: "textarea" },
  { name: "vision", label: "Tầm nhìn (trang Giới thiệu)", type: "textarea" },
  { name: "core_values", label: "Giá trị cốt lõi", type: "textarea", hint: "Mỗi dòng một giá trị, dạng “Tên | Mô tả”" },
  { name: "announcement", label: "Thanh thông báo đầu trang", hint: "Để trống để ẩn thanh thông báo" },
  { name: "announcement_url", label: "Link của thanh thông báo", hint: "VD: /lien-he hoặc /tin-tuc/ten-bai-viet" },
];

export default async function AdminSettings({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const { error, saved } = await searchParams;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("settings").select("*").eq("id", 1).maybeSingle();
  const s = (data ?? {}) as Partial<Settings>;

  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900">Cài đặt thông tin công ty</h1>
      <div className="mt-4"><Flash error={error} saved={saved} /></div>
      <form action={saveSettings} className="max-w-3xl space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="label" htmlFor={f.name}>{f.label}{f.required && " *"}</label>
            {f.type === "textarea" ? (
              <textarea id={f.name} name={f.name} rows={6} defaultValue={s[f.name] ?? ""} className="input" />
            ) : (
              <input id={f.name} name={f.name} required={f.required} defaultValue={s[f.name] ?? ""} className="input" />
            )}
            {f.hint && <p className="mt-1 text-xs text-slate-500">{f.hint}</p>}
          </div>
        ))}
        <button type="submit" className="btn-primary">Lưu cài đặt</button>
      </form>
    </>
  );
}
