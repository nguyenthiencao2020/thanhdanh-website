/** "Thiết bị điện" → "thiet-bi-dien" */
export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** "0907 646 647" → "0907646647" for tel: / zalo links */
export function phoneDigits(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}
