import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServiceClient } from "@/lib/supabase-server";
import { randomInt } from "crypto";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata!;

    const screening_id = meta.screening_id;
    const full_name = meta.full_name;
    const email = meta.email;
    const phone = meta.phone;
    const quantity = parseInt(meta.quantity);
    const referral_code = meta.referral_code;

    const supabase = createServiceClient();

    const { error: rpcErr } = await supabase.rpc("increment_tickets_sold", {
      p_screening_id: screening_id,
      p_qty: quantity,
    });

    if (rpcErr) {
      if (rpcErr.message.includes("SOLD_OUT")) {
        await stripe.refunds.create({
          payment_intent: session.payment_intent as string,
        });
        console.error(`Auto-refunded session ${session.id}: screening sold out`);
      }
      return NextResponse.json({ error: rpcErr.message }, { status: 500 });
    }

    const price_per_ticket = parseFloat(process.env.NEXT_PUBLIC_TICKET_PRICE || "18.00");
    const year = new Date().getFullYear();
    const rand = randomInt(0, 100000).toString().padStart(5, "0");
    const ticket_number = `BK-${year}-${rand}`;

    const { error: insertErr } = await supabase.from("tickets").insert({
      ticket_number,
      screening_id,
      full_name,
      email,
      phone: phone || null,
      quantity,
      price_per_ticket,
      price_total: price_per_ticket * quantity,
      status: "confirmed",
      referral_code: referral_code || null,
      stripe_session_id: session.id,
    });

    if (insertErr) {
      console.error("Ticket insert failed:", insertErr);
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    console.log(`Ticket ${ticket_number} confirmed for ${email}`);
  }

  return NextResponse.json({ received: true });
}
