import { createServiceClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const db = createServiceClient();
  const url = request.nextUrl;
  const page = parseInt(url.searchParams.get("page") || "1");
  const perPage = 50;
  const format = url.searchParams.get("format");
  const search = url.searchParams.get("search");
  const screeningId = url.searchParams.get("screening_id");
  const status = url.searchParams.get("status");
  const referralCode = url.searchParams.get("referral_code");
  const dateFrom = url.searchParams.get("date_from");
  const dateTo = url.searchParams.get("date_to");

  let query = db.from("tickets").select("*", { count: "exact" });

  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,email.ilike.%${search}%,ticket_number.ilike.%${search}%`
    );
  }
  if (screeningId) {
    query = query.eq("screening_id", screeningId);
  }
  if (status) {
    query = query.eq("status", status);
  }
  if (referralCode) {
    query = query.eq("referral_code", referralCode);
  }
  if (dateFrom) {
    query = query.gte("created_at", dateFrom);
  }
  if (dateTo) {
    query = query.lte("created_at", dateTo + "T23:59:59");
  }

  query = query.order("created_at", { ascending: false });

  if (format === "csv") {
    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const screeningIds = Array.from(
      new Set((data || []).map((t) => t.screening_id))
    );
    let screeningsMap: Record<string, { venue_name: string; date: string; time: string; city: string; state: string }> = {};
    if (screeningIds.length > 0) {
      const { data: screenings } = await db
        .from("screenings")
        .select("id,venue_name,date,time,city,state")
        .in("id", screeningIds);
      (screenings || []).forEach((s) => {
        screeningsMap[s.id] = s;
      });
    }

    const headers = [
      "Ticket #",
      "Full Name",
      "Email",
      "Phone",
      "Venue",
      "Date",
      "Time",
      "City",
      "State",
      "Qty",
      "Total",
      "Status",
      "Referral Code",
      "Purchase Date",
    ];
    const rows = (data || []).map((t) => {
      const s = screeningsMap[t.screening_id];
      return [
        t.ticket_number,
        t.full_name,
        t.email,
        t.phone || "",
        s?.venue_name || "",
        s?.date || "",
        s?.time || "",
        s?.city || "",
        s?.state || "",
        t.quantity,
        t.price_total,
        t.status,
        t.referral_code || "",
        t.created_at,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=tickets-export.csv",
      },
    });
  }

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const screeningIds = Array.from(
    new Set((data || []).map((t) => t.screening_id))
  );
  let screeningsMap: Record<string, { venue_name: string; date: string; time: string; city: string; state: string }> = {};
  if (screeningIds.length > 0) {
    const { data: screenings } = await db
      .from("screenings")
      .select("id,venue_name,date,time,city,state")
      .in("id", screeningIds);
    (screenings || []).forEach((s) => {
      screeningsMap[s.id] = s;
    });
  }

  const ticketsWithScreening = (data || []).map((t) => ({
    ...t,
    screening: screeningsMap[t.screening_id] || null,
  }));

  return NextResponse.json({
    tickets: ticketsWithScreening,
    total: count || 0,
    page,
    perPage,
    totalPages: Math.ceil((count || 0) / perPage),
  });
}
