"use client";

import { startTransition, useActionState, useEffect, useId, useRef, useState } from "react";
import { submitInquiry, type QuoteState } from "@/app/actions";
import { Icon } from "./Icon";

type Props = { productId?: string; productName?: string; compact?: boolean; defaultMessage?: string };
type Photo = { blob: Blob; url: string };

const MAX_PHOTOS = 3;
const MAX_SIDE = 1600;

/** Shrinks a phone photo to at most 1600px (JPEG) so it uploads fast; small JPG/PNG/WEBP pass through. */
async function shrink(file: File): Promise<Blob> {
  const passthrough = ["image/jpeg", "image/png", "image/webp"].includes(file.type) && file.size <= 600 * 1024;
  if (passthrough) return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
  if (!blob) throw new Error("encode");
  return blob;
}

export function QuoteForm({ productId, productName, compact, defaultMessage }: Props) {
  const [state, action, pending] = useActionState<QuoteState, FormData>(submitInquiry, null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoError, setPhotoError] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  // Free preview URLs when photos are removed or the form unmounts.
  const urls = useRef<string[]>([]);
  urls.current = photos.map((p) => p.url);
  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), []);

  if (state?.ok) {
    return <p className="mt-4 rounded-md bg-green-50 p-4 text-sm font-medium text-green-800">{state.message}</p>;
  }

  async function addPhotos(list: FileList | null) {
    if (!list?.length) return;
    setPhotoError("");
    setBusy(true);
    const room = MAX_PHOTOS - photos.length;
    const picked = Array.from(list).slice(0, room);
    const added: Photo[] = [];
    for (const file of picked) {
      try {
        const blob = await shrink(file);
        added.push({ blob, url: URL.createObjectURL(blob) });
      } catch {
        setPhotoError("Không đọc được ảnh này — vui lòng chọn ảnh JPG/PNG hoặc gửi qua Zalo.");
      }
    }
    if (list.length > room) setPhotoError(`Tối đa ${MAX_PHOTOS} ảnh.`);
    setPhotos((p) => [...p, ...added]);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removePhoto(i: number) {
    setPhotos((p) => {
      URL.revokeObjectURL(p[i].url);
      return p.filter((_, j) => j !== i);
    });
  }

  // Submitted via onSubmit (not the form `action` prop) so React does not clear what the visitor
  // typed when the server answers with an error (e.g. a mistyped phone number).
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    form.set("page", window.location.pathname + window.location.search);
    form.delete("photos");
    photos.forEach((p, i) => form.append("photos", p.blob, `tem-nhan-${i + 1}.${p.blob.type === "image/png" ? "png" : p.blob.type === "image/webp" ? "webp" : "jpg"}`));
    startTransition(() => action(form));
  }

  const message = defaultMessage ?? (productName ? `Báo giá: ${productName}\nSố lượng: ` : undefined);

  return (
    <form onSubmit={submit} className="mt-4 grid gap-4 sm:grid-cols-2">
      {productId && <input type="hidden" name="product_id" value={productId} />}
      <div className="hidden" aria-hidden="true">
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div>
        <label className="label" htmlFor={`${id}-name`}>Họ tên *</label>
        <input id={`${id}-name`} name="name" required maxLength={120} className="input" autoComplete="name" />
      </div>
      <div>
        <label className="label" htmlFor={`${id}-phone`}>Số điện thoại *</label>
        <input id={`${id}-phone`} name="phone" type="tel" required maxLength={30} className="input" autoComplete="tel" />
      </div>
      {!compact && (
        <>
          <div>
            <label className="label" htmlFor={`${id}-email`}>Email</label>
            <input id={`${id}-email`} name="email" type="email" maxLength={200} className="input" autoComplete="email" />
          </div>
          <div>
            <label className="label" htmlFor={`${id}-company`}>Công ty</label>
            <input id={`${id}-company`} name="company" maxLength={200} className="input" autoComplete="organization" />
          </div>
        </>
      )}
      <div className="sm:col-span-2">
        <label className="label" htmlFor={`${id}-message`}>{compact ? "Mã hàng, số lượng / ghi chú" : "Nội dung yêu cầu (mã hàng, số lượng…)"}</label>
        <textarea id={`${id}-message`} name="message" rows={compact ? 3 : 5} maxLength={4000} className="input" defaultValue={message} />
      </div>

      {/* Nameplate photos */}
      <div className="sm:col-span-2">
        <p className="label">Ảnh tem nhãn / thiết bị <span className="font-normal text-slate-500">(không bắt buộc, tối đa {MAX_PHOTOS} ảnh)</span></p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          {photos.map((p, i) => (
            <div key={p.url} className="relative h-20 w-20 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.url} alt={`Ảnh ${i + 1}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                aria-label={`Bỏ ảnh ${i + 1}`}
                className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/70 text-white hover:bg-brand-600"
              >
                <Icon name="close" className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <label
              htmlFor={`${id}-photos`}
              className={`flex h-20 cursor-pointer items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 text-sm font-semibold text-steel-700 transition hover:border-brand-500 hover:text-brand-600 ${busy ? "opacity-60" : ""}`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.6l1.2-1.8A1.5 1.5 0 0 1 9.5 3.5h5a1.5 1.5 0 0 1 1.2.7L16.9 6h1.6A2.5 2.5 0 0 1 21 8.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5z" />
                <circle cx="12" cy="13" r="3.5" />
              </svg>
              {busy ? "Đang xử lý ảnh…" : photos.length ? "Thêm ảnh" : "Chụp / chọn ảnh tem nhãn"}
            </label>
          )}
          <input
            ref={inputRef}
            id={`${id}-photos`}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => addPhotos(e.target.files)}
          />
        </div>
        {photoError && <p className="mt-2 text-sm text-brand-700">{photoError}</p>}
      </div>

      {state && !state.ok && <p className="text-sm font-medium text-brand-700 sm:col-span-2">{state.message}</p>}
      <div className="sm:col-span-2">
        <button type="submit" className="btn-primary w-full sm:w-auto" disabled={pending || busy}>
          {pending ? "Đang gửi…" : "Gửi yêu cầu báo giá"}
        </button>
      </div>
    </form>
  );
}
