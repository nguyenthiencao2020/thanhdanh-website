import Link from "next/link";
import { phoneDigits } from "@/lib/utils";
import { Gear } from "./Gear";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";

export function CtaBanner({
  title = "Cần báo giá vật tư cho nhà máy?",
  text = "Gửi danh sách mã hàng, chúng tôi phản hồi nhanh chóng.",
  phone,
  zalo,
}: {
  title?: string;
  text?: string;
  phone?: string | null;
  zalo?: string | null;
}) {
  return (
    <Reveal>
      <div className="relative isolate flex flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-8 text-white shadow-xl shadow-brand-600/20 lg:flex-row lg:items-center lg:p-12">
        <Gear teeth={12} className="animate-spin-slow absolute -top-16 -right-10 -z-10 h-64 w-64 text-white/15" />
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
          <p className="mt-2 text-brand-100">{text}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/lien-he" className="btn bg-white px-6 py-3 text-base text-brand-700 hover:bg-brand-50">
            Gửi yêu cầu báo giá
          </Link>
          {phone && (
            <a href={`tel:${phoneDigits(phone)}`} className="btn border border-white/40 px-6 py-3 text-base text-white hover:bg-white/10">
              <Icon name="phone" className="h-4 w-4" /> {phone}
            </a>
          )}
          {zalo && (
            <a
              href={`https://zalo.me/${phoneDigits(zalo)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn border border-white/40 px-6 py-3 text-base text-white hover:bg-white/10"
            >
              Chat Zalo
            </a>
          )}
        </div>
      </div>
    </Reveal>
  );
}
