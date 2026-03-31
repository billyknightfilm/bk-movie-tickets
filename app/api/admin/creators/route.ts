import { createServiceClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const db = createServiceClient();
  const slug = request.nextUrl.searchParams.get("slug");

  if (slug) {
    const { data: creator, error } = await db
      .from("creator_stats")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !creator) {
      return NextResponse.json(
        { error: "Creator not found" },
        { status: 404 }
      );
    }

    const { data: tickets } = await db
      .from("tickets")
      .select("*")
      .eq("referral_code", slug)
      .order("created_at", { ascending: false });

    const screeningIds = Array.from(
      new Set((tickets || []).map((t) => t.screening_id))
    );
    let screeningsMap: Record<string, { venue_name: string; date: string; time: string }> = {};
    if (screeningIds.length > 0) {
      const { data: screenings } = await db
        .from("screenings")
        .select("id,venue_name,date,time")
        .in("id", screeningIds);
      (screenings || []).forEach((s) => {
        screeningsMap[s.id] = s;
      });
    }

    const ticketsWithScreening = (tickets || []).map((t) => ({
      ...t,
      screening: screeningsMap[t.screening_id] || null,
    }));

    return NextResponse.json({ creator, tickets: ticketsWithScreening });
  }

  const { data, error } = await db
    .from("creator_stats")
    .select("*")
    .order("individual_tickets", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ creators: data });
}

export async function POST(request: NextRequest) {
  const db = createServiceClient();
  const body = await request.json();
  const { name, slug, email, phone } = body;

  if (!name || !slug) {
    return NextResponse.json(
      { error: "Name and slug are required" },
      { status: 400 }
    );
  }

  const { data: existing } = await db
    .from("creators")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "Slug already exists" },
      { status: 409 }
    );
  }

  const insertPayload: Record<string, unknown> = {
    name,
    slug,
    email: email || null,
  };
  if (phone) insertPayload.phone = phone;

  let { data, error } = await db
    .from("creators")
    .insert(insertPayload)
    .select()
    .single();

  if (error?.message?.includes("phone")) {
    const { name: n, slug: s, email: e } = insertPayload;
    ({ data, error } = await db
      .from("creators")
      .insert({ name: n, slug: s, email: e })
      .select()
      .single());
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ creator: data });
}

export async function PATCH(request: NextRequest) {
  const db = createServiceClient();
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json(
      { error: "Missing creator id" },
      { status: 400 }
    );
  }

  const allowed = ["is_active", "name", "email", "phone"];
  const filtered: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in updates) filtered[key] = updates[key];
  }

  if ("email" in filtered && !filtered.email) filtered.email = null;
  if ("phone" in filtered && !filtered.phone) filtered.phone = null;

  let { data, error } = await db
    .from("creators")
    .update(filtered)
    .eq("id", id)
    .select()
    .single();

  if (error?.message?.includes("phone")) {
    delete filtered.phone;
    ({ data, error } = await db
      .from("creators")
      .update(filtered)
      .eq("id", id)
      .select()
      .single());
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ creator: data });
}

export async function DELETE(request: NextRequest) {
  const db = createServiceClient();
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json(
      { error: "Missing creator id" },
      { status: 400 }
    );
  }

  const { error } = await db
    .from("creators")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
