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

/**
 * Public address of the site (share images, sitemap, robots). NEXT_PUBLIC_SITE_URL wins; on Vercel
 * the production domain is used when it is not set, so shared links never point at localhost.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  "http://localhost:3000"
).replace(/\/$/, "");

/** Small (160×120) version of a bundled category photo for menus and chips; other URLs pass through. */
export function categoryThumb(url: string) {
  return url.startsWith("/img/dm/") && !url.includes("/nho/") ? url.replace("/img/dm/", "/img/dm/nho/") : url;
}
