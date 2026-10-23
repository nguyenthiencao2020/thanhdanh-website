import Link from "next/link";
import { saveProduct } from "@/app/admin/actions";
import type { Brand, Category, Product } from "@/lib/types";

type Props = { product?: Product; categories: Category[]; brands: Brand[] };

export function ProductForm({ product, categories, brands }: Props) {
  return (
    <form action={saveProduct} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {product && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="image_url" value={product?.image_url ?? ""} />
      <input type="hidden" name="datasheet_url" value={product?.datasheet_url ?? ""} />

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
          <p className="mt-1 text-xs text-slate-500">Cách một dòng trống để tách đoạn. Dòng bắt đầu bằng “## ” là tiêu đề, “- ” là gạch đầu dòng.</p>
        </div>
        <div>
          <label className="label" htmlFor="specs">Thông số kỹ thuật</label>
          <textarea
            id="specs"
            name="specs"
            rows={6}
            defaultValue={product?.specs ?? ""}
            placeholder={"Điện áp | 24 VDC\nDòng định mức | 16 A\nKích thước | 18 × 85 × 70 mm"}
            className="input font-mono text-xs"
          />
          <p className="mt-1 text-xs text-slate-500">Mỗi dòng một thông số, dạng “Tên | Giá trị”. Hiển thị thành bảng ở tab Thông số kỹ thuật.</p>
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
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="in_stock" defaultChecked={product?.in_stock ?? true} /> Còn hàng (bỏ chọn = “Đặt hàng”)
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
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="label">Ảnh phụ (gallery)</p>
          {product?.gallery && product.gallery.length > 0 && (
            <div className="mb-3 grid grid-cols-3 gap-2">
              {product.gallery.map((url) => (
                <label key={url} className="relative block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="aspect-square w-full rounded border border-slate-200 object-contain" />
                  <span className="mt-1 flex items-center gap-1 text-xs">
                    <input type="checkbox" name="gallery_keep" value={url} defaultChecked /> Giữ
                  </span>
                </label>
              ))}
            </div>
          )}
          <input type="file" name="gallery_new" multiple accept="image/jpeg,image/png,image/webp" className="block w-full text-sm" />
          <p className="mt-1 text-xs text-slate-500">Chọn nhiều ảnh. Tổng dung lượng mỗi lần lưu nên dưới 4MB.</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="label">Datasheet (PDF)</p>
          {product?.datasheet_url && (
            <div className="mb-3 text-sm">
              <a href={product.datasheet_url} target="_blank" rel="noopener noreferrer" className="text-steel-600 hover:underline">Xem file hiện tại ↗</a>
              <label className="mt-1 flex items-center gap-2 text-brand-700">
                <input type="checkbox" name="remove_datasheet" /> Xóa datasheet
              </label>
            </div>
          )}
          <input type="file" name="datasheet" accept="application/pdf" className="block w-full text-sm" />
          <p className="mt-1 text-xs text-slate-500">PDF tối đa 4MB.</p>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="btn-primary flex-1">Lưu</button>
          <Link href="/admin/san-pham" className="btn-outline">Hủy</Link>
        </div>
      </div>
    </form>
  );
}
