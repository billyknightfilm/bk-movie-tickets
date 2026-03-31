import Link from "next/link";
import Footer from "@/components/Footer";

export default function TermsOfUsePage() {
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
          Terms of Use
        </h1>
        <p className="font-montserrat text-white/20 text-[12px] mb-12">
          Last updated: March 28, 2026
        </p>

        <div className="space-y-8 pb-16">
          <section>
            <h2 className="font-bebas text-white/40 text-[13px] tracking-[0.2em] mb-3">
              ACCEPTANCE OF TERMS
            </h2>
            <p className="font-montserrat font-light text-white/50 text-[14px] leading-[1.8]">
              By accessing or using this website, you agree to be bound by these
              Terms of Use. If you do not agree with any part of these terms,
              please do not use our site.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-white/40 text-[13px] tracking-[0.2em] mb-3">
              TICKET PURCHASES
            </h2>
            <p className="font-montserrat font-light text-white/50 text-[14px] leading-[1.8]">
              All ticket sales are final. Tickets are non-transferable and valid
              only for the specific screening date, time, and venue indicated at
              the time of purchase. Prices are displayed in the local currency
              and include applicable fees unless otherwise noted.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-white/40 text-[13px] tracking-[0.2em] mb-3">
              REFUNDS &amp; CANCELLATIONS
            </h2>
            <p className="font-montserrat font-light text-white/50 text-[14px] leading-[1.8]">
              Refunds may be issued at our sole discretion in the event of a
              screening cancellation or significant schedule change. If a
              screening is cancelled, ticket holders will be notified by email
              and offered a refund or exchange. Requests for refunds outside of
              these circumstances will be reviewed on a case-by-case basis.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-white/40 text-[13px] tracking-[0.2em] mb-3">
              USER CONDUCT
            </h2>
            <p className="font-montserrat font-light text-white/50 text-[14px] leading-[1.8]">
              You agree not to use this site for any unlawful purpose, attempt
              to gain unauthorized access to any part of the site, interfere
              with the proper functioning of the site, or use automated systems
              to access the site in a manner that exceeds reasonable use.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-white/40 text-[13px] tracking-[0.2em] mb-3">
              INTELLECTUAL PROPERTY
            </h2>
            <p className="font-montserrat font-light text-white/50 text-[14px] leading-[1.8]">
              All content on this website, including text, graphics, logos,
              images, and video, is the property of Billy Knight Film and is
              protected by applicable copyright and trademark laws.
              Reproduction, distribution, or modification of any content
              without prior written consent is prohibited.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-white/40 text-[13px] tracking-[0.2em] mb-3">
              LIMITATION OF LIABILITY
            </h2>
            <p className="font-montserrat font-light text-white/50 text-[14px] leading-[1.8]">
              This website and its content are provided &ldquo;as is&rdquo;
              without warranties of any kind. To the fullest extent permitted
              by law, Billy Knight Film shall not be liable for any indirect,
              incidental, or consequential damages arising from your use of the
              site or purchase of tickets.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-white/40 text-[13px] tracking-[0.2em] mb-3">
              THIRD-PARTY LINKS
            </h2>
            <p className="font-montserrat font-light text-white/50 text-[14px] leading-[1.8]">
              Our site may contain links to third-party websites. These links
              are provided for convenience only. We have no control over the
              content of external sites and assume no responsibility for their
              content or practices.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-white/40 text-[13px] tracking-[0.2em] mb-3">
              CHANGES TO THESE TERMS
            </h2>
            <p className="font-montserrat font-light text-white/50 text-[14px] leading-[1.8]">
              We reserve the right to modify these Terms of Use at any time.
              Changes will be posted on this page with an updated revision date.
              Your continued use of the site following any changes constitutes
              acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="font-bebas text-white/40 text-[13px] tracking-[0.2em] mb-3">
              CONTACT
            </h2>
            <p className="font-montserrat font-light text-white/50 text-[14px] leading-[1.8]">
              If you have questions about these Terms of Use, please contact us
              at{" "}
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
