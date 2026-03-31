import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: Record<string, unknown> = {};

  try {
    const supabase = createServiceClient();

    // 1. Test connection by reading tickets
    const { data: tickets, error: readErr } = await supabase
      .from("tickets")
      .select("*")
      .limit(5);

    results.read_tickets = readErr
      ? { error: JSON.parse(JSON.stringify(readErr)) }
      : { count: tickets?.length, sample: tickets?.map(t => ({ id: t.id, ticket_number: t.ticket_number, status: t.status, stripe_session: t.stripe_session })) };

    // 2. Check table columns by reading one row
    if (tickets && tickets.length > 0) {
      results.columns = Object.keys(tickets[0]);
    }

    // 3. Try a test insert and immediately delete it
    const test_ticket_number = `TEST-${Date.now()}`;
    const { error: insertErr } = await supabase.from("tickets").insert({
      ticket_number: test_ticket_number,
      screening_id: "00000000-0000-0000-0000-000000000000",
      full_name: "TEST USER",
      email: "test@test.com",
      quantity: 1,
      price_per_ticket: 0,
      price_total: 0,
      status: "paid",
      stripe_session: `test_${Date.now()}`,
    });

    results.test_insert = insertErr
      ? { error: JSON.parse(JSON.stringify(insertErr)) }
      : { success: true };

    // Clean up test row
    if (!insertErr) {
      await supabase.from("tickets").delete().eq("ticket_number", test_ticket_number);
      results.test_cleanup = "deleted";
    }

    // 4. Check env vars are set (don't reveal values)
    results.env = {
      SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      SUPABASE_SERVICE_KEY_LENGTH: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
      TICKET_PRICE: process.env.NEXT_PUBLIC_TICKET_PRICE || "not set",
    };
  } catch (err) {
    results.crash = String(err);
  }

  return NextResponse.json(results, { status: 200 });
}
