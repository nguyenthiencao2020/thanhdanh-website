import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { supabaseAnonKey, supabaseUrl } from "./config";

/** Client bound to the visitor's auth cookies — use in admin pages and server actions. */
export async function createSessionClient() {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component: cookies are read-only there; middleware refreshes them.
        }
      },
    },
  });
}

/**
 * Anonymous client without cookies — keeps public pages statically cacheable.
 * Reads go through Next's data cache for 60s (same window as the site's ISR), so pages that vary
 * by query string (filters, sort, pagination) render without a database round-trip on every click.
 * Pass `{ cache: false }` where every call must reach the database. Admin saves call revalidatePath("/", "layout"), which also clears these cached reads.
 */
export function createPublicClient({ cache = true }: { cache?: boolean } = {}) {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
    global: {
      fetch: (input, init) =>
        fetch(input, { ...init, ...(cache && (!init?.method || init.method === "GET") ? { next: { revalidate: 60 } } : { cache: "no-store" }) }),
    },
  });
}
