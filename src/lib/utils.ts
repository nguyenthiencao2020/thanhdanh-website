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

/** The company's own domain — used for production builds on Vercel. */
export const PRODUCTION_DOMAIN = "https://www.thietbinhamay-dd.com";

/**
 * Public address of the site (canonical links, share images, sitemap, robots).
 * NEXT_PUBLIC_SITE_URL wins; otherwise production builds on Vercel use the company domain
 * (VERCEL_PROJECT_PRODUCTION_URL can be the *.vercel.app name), previews their own Vercel URL.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  (process.env.VERCEL_ENV === "production" ? PRODUCTION_DOMAIN : "") ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
  "http://localhost:3000"
).replace(/\/$/, "");

/** Small (160×120) version of a bundled category photo for menus and chips; other URLs pass through. */
export function categoryThumb(url: string) {
  return url.startsWith("/img/dm/") && !url.includes("/nho/") ? url.replace("/img/dm/", "/img/dm/nho/") : url;
}
