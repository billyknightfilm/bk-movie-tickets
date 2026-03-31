import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { resend } from "@/lib/resend";
import { buildTicketEmailHtml } from "@/lib/ticket-email";

export async function POST() {
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
      email_sent,
      screening_id,
      screenings:screening_id (venue_name, address, city, state, date, time)
    `
    )
    .is("email_sent", null)
    .in("status", ["confirmed", "paid"]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!tickets || tickets.length === 0) {
    return NextResponse.json({ message: "No unsent confirmations", sent: 0 });
  }

  let sent = 0;
  const errors: string[] = [];

  for (const ticket of tickets) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const screening = (ticket as any).screenings as {
      venue_name: string;
      address: string;
      city: string;
      state: string;
      date: string;
      time: string;
    } | null;

    if (!screening || !ticket.email) continue;

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

      await supabase
        .from("tickets")
        .update({ email_sent: true })
        .eq("id", ticket.id);

      sent++;
    } catch (err) {
      errors.push(`${ticket.ticket_number}: ${err}`);
    }
  }

  return NextResponse.json({ sent, total: tickets.length, errors });
}
