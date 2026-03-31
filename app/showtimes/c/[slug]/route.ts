import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const supabase = createServiceClient();

  const { data: creator } = await supabase
    .from("creators")
    .select("is_active")
    .eq("slug", slug)
    .single();

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (creator?.is_active) {
    return NextResponse.redirect(new URL(`/showtimes?ref=${slug}`, base));
  }

  return NextResponse.redirect(new URL("/showtimes", base));
}
