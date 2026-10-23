import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createPublicClient } from "@/lib/supabase/server";

// Called once a day by Vercel Cron (see vercel.json) so the free-tier Supabase
// project always has recent activity and is not paused after 7 idle days.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Vercel sends `Authorization: Bearer <CRON_SECRET>` when that env var is set.
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured) {
    return NextResponse.json({ ok: false, error: "Supabase is not configured" }, { status: 503 });
  }

  const { error } = await createPublicClient({ cache: false }).from("settings").select("id").eq("id", 1).maybeSingle();
  if (error) {
    console.error("keep-alive", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, at: new Date().toISOString() });
}
