/**
 * Google Maps for the contact page and footer. Admin may paste any Google Maps link — the iframe needs
 * an embeddable URL, so share links (maps.app.goo.gl) are followed to the full map URL and turned into
 * an embed that pins the exact place.
 */

const EMBED = (q: string) => `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=17&hl=vi&output=embed`;

/** Embed URL from a full Google Maps URL, or null if it has no usable place. */
export function embedFromMapsUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (!/(^|\.)google\.[a-z.]+$/.test(url.hostname)) return null;
  if (url.searchParams.get("output") === "embed" || url.pathname.startsWith("/maps/embed")) return raw;
  // Exact pin of a place: …!3d10.75!4d106.60…
  const pin = raw.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  if (pin) return EMBED(`${pin[1]},${pin[2]}`);
  const place = url.pathname.match(/\/maps\/place\/([^/]+)/);
  if (place) return EMBED(decodeURIComponent(place[1].replace(/\+/g, " ")));
  const q = url.searchParams.get("q") ?? url.searchParams.get("query");
  if (q) return EMBED(q);
  // Map centre: /@10.75,106.60,17z
  const at = url.pathname.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (at) return EMBED(`${at[1]},${at[2]}`);
  return null;
}

const isShortLink = (u: string) => /^https:\/\/(maps\.app\.goo\.gl|goo\.gl\/maps)\//.test(u);

/** Embed URL for any Google Maps link (share links are resolved, cached for a day); falls back to the address. */
export async function resolveMapEmbed(link: string | null | undefined, address?: string | null): Promise<string | null> {
  const fallback = address ? EMBED(address) : null;
  if (!link) return fallback;
  if (!isShortLink(link)) return embedFromMapsUrl(link) ?? fallback;
  try {
    let current = link;
    for (let hop = 0; hop < 4 && isShortLink(current); hop++) {
      const res = await fetch(current, {
        redirect: "manual",
        headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36", "accept-language": "vi" },
        next: { revalidate: 86400 },
      });
      // Usually a 302; some responses are a page that points on to the map instead.
      const next = res.headers.get("location") ?? (res.ok ? (await res.text()).match(/https:\/\/www\.google\.[a-z.]+\/maps[^"'\s<>\\]+/)?.[0]?.replace(/&amp;/g, "&") : null);
      if (!next) break;
      current = new URL(next, current).toString();
    }
    return embedFromMapsUrl(current) ?? fallback;
  } catch {
    return fallback;
  }
}
