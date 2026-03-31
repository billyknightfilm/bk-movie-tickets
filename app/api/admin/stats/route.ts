import { createServiceClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET() {
  const db = createServiceClient();

  const [ticketsRes, screeningsRes, creatorsRes] = await Promise.all([
    db.from("tickets").select("*"),
    db
      .from("screenings")
      .select("*")
      .eq("is_active", true),
    db.from("creator_stats").select("*"),
  ]);

  const tickets = ticketsRes.data || [];
  const screenings = screeningsRes.data || [];
  const creators = creatorsRes.data || [];

  const paidTickets = tickets.filter((t) => t.status === "paid");
  const totalTicketsSold = paidTickets.reduce(
    (sum, t) => sum + (t.quantity || 0),
    0
  );
  const totalRevenue = paidTickets.reduce(
    (sum, t) => sum + Number(t.price_total || 0),
    0
  );
  const activeScreenings = screenings.filter(
    (s) => s.status === "PUBLISHED"
  ).length;

  const topCreator =
    creators.length > 0
      ? creators.sort(
          (a, b) => (b.individual_tickets || 0) - (a.individual_tickets || 0)
        )[0]
      : null;

  const ticketsByDay: Record<string, number> = {};
  tickets.forEach((t) => {
    const day = t.created_at?.split("T")[0];
    if (day) ticketsByDay[day] = (ticketsByDay[day] || 0) + (t.quantity || 0);
  });
  const ticketsPerDay = Object.entries(ticketsByDay)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const recentTickets = [...tickets]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 10);

  const screeningMap: Record<string, (typeof screenings)[0]> = {};
  screenings.forEach((s) => {
    screeningMap[s.id] = s;
  });

  const recentWithScreening = recentTickets.map((t) => ({
    ...t,
    screening: screeningMap[t.screening_id] || null,
  }));

  return NextResponse.json({
    totalTicketsSold,
    totalRevenue,
    activeScreenings,
    topCreator: topCreator
      ? { name: topCreator.name, tickets: topCreator.individual_tickets }
      : null,
    ticketsPerDay,
    recentTickets: recentWithScreening,
  });
}
