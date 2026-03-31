import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Link from "next/link";

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

  return (
    <main className="min-h-screen bg-bk-black flex items-center justify-center px-6 relative">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(240,201,58,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md text-center">
        <div
          className="w-16 h-16 mx-auto mb-7 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(240,201,58,0.08)",
            border: "1px solid rgba(240,201,58,0.15)",
          }}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(240,201,58,0.8)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 className="font-cormorant italic text-bk-white text-[26px] md:text-[30px] leading-snug mb-2">
          Payment confirmed.
        </h1>
        <p className="font-montserrat text-white/30 text-[13px] mb-10">
          Your ticket confirmation will arrive at{" "}
          <span className="text-white/50">{meta.email}</span>
        </p>

        <div
          className="rounded-xl p-6 mb-10 text-left"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <p className="font-bebas text-white/20 text-[10px] tracking-[0.3em] mb-4">
            ORDER DETAILS
          </p>

          <div className="space-y-3">
            <div>
              <p className="font-montserrat text-white/25 text-[10px] tracking-wider">
                NAME
              </p>
              <p className="font-montserrat text-bk-white text-[14px]">
                {meta.full_name}
              </p>
            </div>
            <div>
              <p className="font-montserrat text-white/25 text-[10px] tracking-wider">
                TICKETS
              </p>
              <p className="font-montserrat text-bk-white text-[14px]">
                {meta.quantity} &times; $
                {parseFloat(
                  process.env.NEXT_PUBLIC_TICKET_PRICE || "18.00"
                ).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="font-montserrat text-white/25 text-[10px] tracking-wider">
                TOTAL PAID
              </p>
              <p className="font-bebas text-bk-gold text-[24px] leading-none mt-0.5">
                ${((session.amount_total || 0) / 100).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/showtimes"
          className="font-montserrat text-white/30 text-[12px] tracking-wider hover:text-white/60 transition-colors duration-300"
        >
          &larr; BACK TO SHOWTIMES
        </Link>
      </div>
    </main>
  );
}
