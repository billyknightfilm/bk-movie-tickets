import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { resend } from "@/lib/resend";
import { buildTicketEmailHtml } from "@/lib/ticket-email";

export async function POST(request: NextRequest) {
  const auth = request.headers.get("x-api-key");
  if (auth !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();

  const { data: tickets, error } = await supabase
    .from("tickets")
    .select(
      `
      id,
      ticket_number,
      full_name,
      email,
      quantity,
      price_per_ticket,
      price_total,
      status,
      screening_id
    `
    )
    .in("status", ["confirmed", "paid"]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!tickets || tickets.length === 0) {
    return NextResponse.json({ message: "No tickets found", sent: 0 });
  }

  let sent = 0;
  const errors: string[] = [];

  for (const ticket of tickets) {
    if (!ticket.email) continue;

    const { data: screening } = await supabase
      .from("screenings")
      .select("venue_name, address, city, state, date, time")
      .eq("id", ticket.screening_id)
      .single();

    if (!screening) continue;

    try {
      await resend.emails.send({
        from: "Billy Knight <tickets@billyknightmovie.com>",
        to: ticket.email,
        subject: `Your Billy Knight Ticket — ${ticket.ticket_number}`,
        html: buildTicketEmailHtml({
          ticketNumber: ticket.ticket_number,
          fullName: ticket.full_name,
          venueName: screening.venue_name,
          address: screening.address,
          city: screening.city,
          state: screening.state,
          date: screening.date,
          time: screening.time,
          quantity: ticket.quantity,
          pricePerTicket: ticket.price_per_ticket,
          total: ticket.price_total,
        }),
      });
      sent++;
    } catch (err) {
      errors.push(`${ticket.ticket_number}: ${err}`);
    }
  }

  return NextResponse.json({ sent, total: tickets.length, errors });
}
