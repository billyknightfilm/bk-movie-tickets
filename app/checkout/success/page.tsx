import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import ConfirmationView from "@/components/ConfirmationView";

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
  const confirmationNumber = "BK-" + sessionId.slice(-5).toUpperCase();

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
