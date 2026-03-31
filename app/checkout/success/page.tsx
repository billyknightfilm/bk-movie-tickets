import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { createServiceClient } from "@/lib/supabase-server";
import { resend } from "@/lib/resend";
import { buildTicketEmailHtml } from "@/lib/ticket-email";
import ConfirmationView from "@/components/ConfirmationView";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;
  if (!sessionId) redirect("/showtimes");

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    redirect("/showtimes");
  }

  if (session.payment_status !== "paid") redirect("/showtimes");

  const meta = session.metadata!;
  let confirmationNumber = "BK-" + sessionId.slice(-5).toUpperCase();

  try {
    const supabase = createServiceClient();

    const { data: existing, error: checkErr } = await supabase
      .from("tickets")
      .select("id, ticket_number")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (checkErr) {
      console.error("Fallback: ticket lookup failed:", JSON.stringify(checkErr));
    }

    if (existing) {
      confirmationNumber = existing.ticket_number;
    } else if (!checkErr) {
      const screening_id = meta.screening_id;
      const quantity = parseInt(meta.quantity);
      const price_per_ticket = parseFloat(process.env.NEXT_PUBLIC_TICKET_PRICE || "18.00");
      const rand = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
      const ticket_number = `BK-${new Date().getFullYear()}-${rand}`;

      const { error: insertErr } = await supabase.from("tickets").insert({
        ticket_number,
        screening_id,
        full_name: meta.full_name,
        email: meta.email,
        phone: meta.phone || null,
        quantity,
        price_per_ticket,
        price_total: price_per_ticket * quantity,
        status: "paid",
        referral_code: meta.referral_code || null,
        stripe_session_id: sessionId,
      });

      if (insertErr) {
        console.error("Fallback: ticket insert failed:", JSON.stringify(insertErr));
      } else {
        confirmationNumber = ticket_number;

        const { error: rpcErr } = await supabase.rpc("increment_tickets_sold", {
          p_screening_id: screening_id,
          p_qty: quantity,
        });
        if (rpcErr) {
          console.error("Fallback: increment_tickets_sold failed:", JSON.stringify(rpcErr));
        }

        const { data: screening } = await supabase
          .from("screenings")
          .select("venue_name, address, city, state, date, time")
          .eq("id", screening_id)
          .single();

        if (screening) {
          try {
            await resend.emails.send({
              from: "Billy Knight <tickets@billyknightmovie.com>",
              to: meta.email,
              subject: `Your Billy Knight Ticket — ${ticket_number}`,
              html: buildTicketEmailHtml({
                ticketNumber: ticket_number,
                fullName: meta.full_name,
                venueName: screening.venue_name,
                address: screening.address,
                city: screening.city,
                state: screening.state,
                date: screening.date,
                time: screening.time,
                quantity,
                pricePerTicket: price_per_ticket,
                total: price_per_ticket * quantity,
              }),
            });

            await supabase
              .from("tickets")
              .update({ email_sent: true })
              .eq("ticket_number", ticket_number);
          } catch (emailErr) {
            console.error("Fallback: email send failed:", emailErr);
          }
        }
      }
    }
  } catch (err) {
    console.error("Fallback ticket creation crashed:", err);
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center relative"
      style={{
        background: "linear-gradient(160deg, #0f0c08, #080604, #0d0a05)",
      }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(212,175,55,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full">
        <ConfirmationView
          confirmationNumber={confirmationNumber}
          fullName={meta.full_name}
          venueName={meta.venue_name || ""}
          venueCity={meta.city || ""}
          venueState={meta.state || ""}
          screeningDate={meta.date || ""}
          screeningTime={meta.time || ""}
          quantity={parseInt(meta.quantity)}
          amountPaid={(session.amount_total || 0) / 100}
        />
      </div>
    </main>
  );
}
