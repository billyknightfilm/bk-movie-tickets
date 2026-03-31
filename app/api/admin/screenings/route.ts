import { createServiceClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const db = createServiceClient();
  const url = request.nextUrl;
  const status = url.searchParams.get("status");
  const venue = url.searchParams.get("venue");
  const dateFrom = url.searchParams.get("date_from");
  const dateTo = url.searchParams.get("date_to");
  const sortBy = url.searchParams.get("sort_by") || "date";
  const showArchived = url.searchParams.get("show_archived") === "true";

  let query = db.from("screenings").select("*");

  if (!showArchived) {
    query = query.eq("is_active", true);
  }
  if (status && status !== "all") {
    query = query.eq("status", status);
  }
  if (venue) {
    query = query.ilike("venue_name", `%${venue}%`);
  }
  if (dateFrom) {
    query = query.gte("date", dateFrom);
  }
  if (dateTo) {
    query = query.lte("date", dateTo);
  }

  if (sortBy === "venue") {
    query = query.order("venue_name").order("date").order("time");
  } else if (sortBy === "tickets_sold") {
    query = query.order("tickets_sold", { ascending: false });
  } else {
    query = query.order("date").order("time");
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ screenings: data });
}

export async function POST(request: NextRequest) {
  const db = createServiceClient();
  const body = await request.json();

  const {
    venue_name,
    address,
    city,
    state,
    zip,
    lat,
    lng,
    date,
    time,
    capacity,
    status,
  } = body;

  if (!venue_name || !address || !city || !state || !zip || !date || !time) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const { data, error } = await db
    .from("screenings")
    .insert({
      venue_name,
      address,
      city,
      state,
      zip,
      lat: lat || 0,
      lng: lng || 0,
      date,
      time,
      capacity: capacity || 200,
      status: status || "DRAFT",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ screening: data });
}

export async function PATCH(request: NextRequest) {
  const db = createServiceClient();
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json(
      { error: "Missing screening id" },
      { status: 400 }
    );
  }

  const allowed = ["status", "capacity", "is_active"];
  const filtered: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in updates) filtered[key] = updates[key];
  }

  const { data, error } = await db
    .from("screenings")
    .update(filtered)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ screening: data });
}
