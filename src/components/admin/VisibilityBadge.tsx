/** Product count with a note when the website hides the item for having no products. */
export function VisibilityBadge({ count }: { count: number }) {
  return count > 0 ? (
    <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">{count} sản phẩm · đang hiện</span>
  ) : (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500" title="Trang web tự ẩn mục chưa có sản phẩm; thêm sản phẩm là tự hiện lại.">
      0 sản phẩm · đang ẩn trên web
    </span>
  );
}
