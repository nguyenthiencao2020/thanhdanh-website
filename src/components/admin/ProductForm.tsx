import Link from "next/link";
import { saveProduct } from "@/app/admin/actions";
import type { Brand, Category, Product } from "@/lib/types";

type Props = { product?: Product; categories: Category[]; brands: Brand[] };

export function ProductForm({ product, categories, brands }: Props) {
  return (
    <form action={saveProduct} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="image_url" value={product?.image_url ?? ""} />

      <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div>
          <label className="label" htmlFor="name">Tên sản phẩm *</label>
          <input id="name" name="name" required defaultValue={product?.name} className="input" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="slug">Đường dẫn (slug)</label>
            <input id="slug" name="slug" defaultValue={product?.slug} placeholder="Tự tạo từ tên" className="input" />
          </div>
          <div>
            <label className="label" htmlFor="sku">Mã hàng</label>
            <input id="sku" name="sku" defaultValue={product?.sku ?? ""} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="category_id">Danh mục</label>
            <select id="category_id" name="category_id" defaultValue={product?.category_id ?? ""} className="input">
              <option value="">— Không —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="brand_id">Thương hiệu</label>
            <select id="brand_id" name="brand_id" defaultValue={product?.brand_id ?? ""} className="input">
              <option value="">— Không —</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="price">Giá hiển thị</label>
          <input id="price" name="price" defaultValue={product?.price ?? ""} placeholder="Để trống = “Liên hệ báo giá”" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="summary">Mô tả ngắn</label>
          <textarea id="summary" name="summary" rows={2} defaultValue={product?.summary ?? ""} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="description">Mô tả chi tiết</label>
          <textarea id="description" name="description" rows={10} defaultValue={product?.description ?? ""} className="input" />
          <p className="mt-1 text-xs text-slate-500">Cách một dòng trống để tách đoạn.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-3 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={product?.published ?? true} /> Hiển thị trên website
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} /> Sản phẩm nổi bật (trang chủ)
          </label>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="label">Ảnh sản phẩm</p>
          {product?.image_url && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.image_url} alt="" className="mb-3 aspect-square w-full rounded border border-slate-200 object-contain" />
              <label className="mb-3 flex items-center gap-2 text-sm text-brand-700">
                <input type="checkbox" name="remove_image" /> Xóa ảnh hiện tại
              </label>
            </>
          )}
          <input type="file" name="image" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" className="block w-full text-sm" />
          <p className="mt-1 text-xs text-slate-500">JPG, PNG, WEBP — tối đa 4MB.</p>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary flex-1">Lưu</button>
          <Link href="/admin/san-pham" className="btn-outline">Hủy</Link>
        </div>
      </div>
    </form>
  );
}
