export function Flash({ error, saved }: { error?: string; saved?: string }) {
  if (error) return <p className="mb-4 rounded-md bg-brand-50 p-3 text-sm font-medium text-brand-700">{error}</p>;
  if (saved) return <p className="mb-4 rounded-md bg-green-50 p-3 text-sm font-medium text-green-800">Đã lưu thay đổi.</p>;
  return null;
}
