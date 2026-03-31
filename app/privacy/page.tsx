import Link from "next/link";
import Footer from "@/components/Footer";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-bk-black flex flex-col">
      <div className="max-w-[720px] mx-auto px-6 w-full flex-1">
        <div className="pt-10 pb-4">
          <Link
            href="/"
            className="font-montserrat font-light text-[11px] tracking-[0.15em] text-white/35 hover:text-white/70 transition-colors duration-300"
          >
            &larr; HOME
          </Link>
        </div>

        <h1 className="font-bebas text-white text-[32px] tracking-[0.02em] mt-8 mb-3">
          Privacy Policy
        </h1>
        <p className="font-montserrat text-white/20 text-[12px] mb-12">
          Last updated: March 28, 2026
        </p>

        <div className="space-y-8 pb-16">
          <section>
            <h2 className="font-bebas text-white/40 text-[13px] tracking-[0.2em] mb-3">
              INFORMATION WE COLLECT
            </h2>
            <p className="font-montserrat font-light text-white/50 text-[14px] leading-[1.8]">
              When you purchase tickets through our site, we collect personal
              information necessary to process your order, including your name,
              email address, and payment details. Payment information is processed
              securely by Stripe and is never stored on our servers.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-white/40 text-[13px] tracking-[0.2em] mb-3">
              HOW WE USE YOUR INFORMATION
            </h2>
            <p className="font-montserrat font-light text-white/50 text-[14px] leading-[1.8]">
              We use the information we collect to process ticket purchases, send
              order confirmations and e-tickets, communicate screening updates or
              schedule changes, and improve our website and services.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-white/40 text-[13px] tracking-[0.2em] mb-3">
              PAYMENT PROCESSING
            </h2>
            <p className="font-montserrat font-light text-white/50 text-[14px] leading-[1.8]">
              All payment transactions are handled by Stripe. Your credit card
              information is transmitted directly to Stripe using industry-standard
              encryption and is subject to{" "}
              <a
                href="https://stripe.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 hover:text-white transition-colors underline underline-offset-2 decoration-white/20 hover:decoration-white/40"
              >
                Stripe&apos;s Privacy Policy
              </a>
              . We do not store your full card details.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-white/40 text-[13px] tracking-[0.2em] mb-3">
              DATA STORAGE
            </h2>
            <p className="font-montserrat font-light text-white/50 text-[14px] leading-[1.8]">
              Account and order data is stored securely using Supabase, a hosted
              database platform with encryption at rest and in transit. We retain
              your data only as long as necessary to fulfill orders and comply
              with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-white/40 text-[13px] tracking-[0.2em] mb-3">
              COOKIES
            </h2>
            <p className="font-montserrat font-light text-white/50 text-[14px] leading-[1.8]">
              We use essential cookies to maintain session state and ensure the
              website functions correctly. We do not use advertising or
              third-party tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-white/40 text-[13px] tracking-[0.2em] mb-3">
              THIRD-PARTY SERVICES
            </h2>
            <p className="font-montserrat font-light text-white/50 text-[14px] leading-[1.8]">
              Our site may contain links to third-party websites or services.
              We are not responsible for the privacy practices of those external
              sites and encourage you to review their policies.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-white/40 text-[13px] tracking-[0.2em] mb-3">
              YOUR RIGHTS
            </h2>
            <p className="font-montserrat font-light text-white/50 text-[14px] leading-[1.8]">
              You may request access to, correction of, or deletion of your
              personal data at any time by contacting us. We will respond to
              your request within a reasonable timeframe.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-white/40 text-[13px] tracking-[0.2em] mb-3">
              CHANGES TO THIS POLICY
            </h2>
            <p className="font-montserrat font-light text-white/50 text-[14px] leading-[1.8]">
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page with an updated revision date. Your
              continued use of the site constitutes acceptance of the revised
              policy.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-white/40 text-[13px] tracking-[0.2em] mb-3">
              CONTACT
            </h2>
            <p className="font-montserrat font-light text-white/50 text-[14px] leading-[1.8]">
              If you have questions about this Privacy Policy, please reach out
              to us at{" "}
              <a
                href="mailto:contact@billyknightmovie.com"
                className="text-white/70 hover:text-white transition-colors underline underline-offset-2 decoration-white/20 hover:decoration-white/40"
              >
                contact@billyknightmovie.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>

      <div className="max-w-[720px] mx-auto px-6 pb-8 w-full">
        <Footer />
      </div>
    </main>
  );
}
