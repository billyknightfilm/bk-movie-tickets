import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  let body: {
    screening_id?: string;
    full_name?: string;
    email?: string;
    phone?: string;
    quantity?: number;
    referral_code?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { screening_id, full_name, email, phone, quantity = 1, referral_code } = body;

  const errors: Record<string, string> = {};
  if (!screening_id) errors.screening_id = "Screening is required";
  if (!full_name?.trim()) errors.full_name = "Full name is required";
  if (!email?.trim()) errors.email = "Email is required";
  if (quantity < 1 || quantity > 8) errors.quantity = "Quantity must be 1-8";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validation failed", fields: errors }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: screening, error: fetchErr } = await supabase
    .from("screenings")
    .select("*")
    .eq("id", screening_id)
    .eq("status", "PUBLISHED")
    .eq("is_active", true)
    .single();

  if (fetchErr || !screening) {
    return NextResponse.json({ error: "Screening not found" }, { status: 404 });
  }

  if (screening.tickets_sold + quantity > screening.capacity) {
    return NextResponse.json({ error: "SOLD_OUT" }, { status: 409 });
  }

  const price_per_ticket = parseFloat(process.env.NEXT_PUBLIC_TICKET_PRICE || "18.00");
  const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL;

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Billy Knight — ${screening.venue_name}`,
              description: `${screening.city}, ${screening.state} · ${screening.date} at ${screening.time}`,
            },
            unit_amount: Math.round(price_per_ticket * 100),
          },
          quantity,
        },
      ],
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: email!.trim(),
      metadata: {
        screening_id: screening_id!,
        full_name: full_name!.trim(),
        email: email!.trim(),
        phone: phone?.trim() || "",
        quantity: String(quantity),
        referral_code: referral_code || "",
      },
    });

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error("Stripe session creation failed:", err);
    return NextResponse.json({ error: "Payment setup failed. Please try again." }, { status: 500 });
  }
}
