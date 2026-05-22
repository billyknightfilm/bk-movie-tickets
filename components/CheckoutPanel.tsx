"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { trackInitiateCheckout } from "@/lib/tiktok-pixel";
import type { Showtime, VenueGroup } from "./ShowtimeCard";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface CheckoutPanelProps {
  showtime: Showtime | null;
  venue: VenueGroup | null;
  onClose: () => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d
    .toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}

function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m} ${ampm}`;
}

function GlassInput({
  label,
  type = "text",
  value,
  onChange,
  note,
  required,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  note?: string;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="mb-4">
      <label className="block font-montserrat font-medium text-white/35 text-[10px] tracking-[0.2em] mb-2">
        {label}
        {required && <span className="text-bk-gold/60 ml-0.5">*</span>}
      </label>
      <div
        className="relative rounded-lg px-4 py-3 transition-all duration-300"
        style={{
          background: focused
            ? "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0.025)",
          border: focused
            ? "1px solid rgba(240,201,58,0.15)"
            : "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent border-0 font-montserrat text-[14px] text-bk-white focus:outline-none placeholder:text-white/15"
        />
      </div>
      {note && (
        <p className="font-montserrat text-white/25 text-[11px] mt-1.5 leading-snug px-0.5">
          {note}
        </p>
      )}
    </div>
  );
}

export default function CheckoutPanel({
  showtime,
  venue,
  onClose,
}: CheckoutPanelProps) {
  const [qty, setQty] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [checkoutData, setCheckoutData] = useState<{
    clientSecret: string;
    screening: { venue: string; date: string; time: string; address: string; city: string; state: string };
    qty: number;
    total: number;
  } | null>(null);

  const price = parseFloat(process.env.NEXT_PUBLIC_TICKET_PRICE || "18.00");
  const total = price * qty;

  const handleSubmit = async () => {
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    trackInitiateCheckout();
    setError("");
    setSubmitting(true);

    const refCode =
      typeof window !== "undefined"
        ? sessionStorage.getItem("bk_ref")
        : null;

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          screening_id: showtime!.id,
          full_name: fullName,
          email,
          phone: phone || undefined,
          quantity: qty,
          referral_code: refCode || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(
          data.error === "SOLD_OUT"
            ? "This showtime is now sold out."
            : data.error || "Something went wrong."
        );
        setSubmitting(false);
        return;
      }

      if (data.clientSecret) {
        setCheckoutData({
          clientSecret: data.clientSecret,
          screening: {
            venue: venue!.venue_name,
            date: showtime!.date,
            time: showtime!.time,
            address: venue!.address,
            city: venue!.city,
            state: venue!.state,
          },
          qty,
          total,
        });
        return;
      }

      setError("Something went wrong. Please try again.");
    } catch {
      setError("Network error. Please try again.");
    }
    setSubmitting(false);
  };

  const handleClose = useCallback(() => {
    setCheckoutData(null);
    setSubmitting(false);
    onClose();
  }, [onClose]);

  const handleBack = useCallback(() => {
    setCheckoutData(null);
    setSubmitting(false);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {showtime && venue && (
        <motion.div
          key={showtime.id}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "auto", opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 22 }}
          className="overflow-hidden flex-shrink-0 hidden md:block"
        >
          <div
            className="w-[340px] lg:w-[380px] h-full flex flex-col relative"
            style={{
              borderLeft: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            {/* Header with close */}
            <div className="flex items-center justify-between px-7 pt-6 pb-4 flex-shrink-0">
              <p className="font-bebas text-white/20 text-[11px] tracking-[0.3em]">
                {checkoutData ? "PAYMENT" : "CHECKOUT"}
              </p>
              <div className="flex items-center gap-2">
                {checkoutData && (
                  <motion.button
                    onClick={handleBack}
                    className="w-7 h-7 flex items-center justify-center rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                    whileHover={{
                      background: "rgba(255,255,255,0.1)",
                    }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Back"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </motion.button>
                )}
                <motion.button
                  onClick={handleClose}
                  className="w-7 h-7 flex items-center justify-center rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                  whileHover={{
                    background: "rgba(255,255,255,0.1)",
                  }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Close"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-7 pb-7">
              <AnimatePresence mode="wait">
                {checkoutData ? (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* Order summary */}
                    <div className="mb-5">
                      <p className="font-bebas text-bk-gold text-[14px] tracking-[0.15em]">
                        {checkoutData.screening.venue}
                      </p>
                      <p className="font-bebas text-bk-white text-[18px] leading-tight mt-0.5">
                        {formatDate(checkoutData.screening.date)} &middot; {formatTime(checkoutData.screening.time)}
                      </p>
                      <p className="font-montserrat text-white/20 text-[11px] mt-1.5">
                        {checkoutData.qty} ticket{checkoutData.qty > 1 ? "s" : ""} &middot; ${checkoutData.total.toFixed(2)}
                      </p>
                    </div>

                    <div className="h-px bg-white/[0.04] mb-5" />

                    {/* Embedded Stripe form */}
                    <div className="stripe-embed-container rounded-lg overflow-hidden">
                      <EmbeddedCheckoutProvider
                        stripe={stripePromise}
                        options={{ clientSecret: checkoutData.clientSecret }}
                      >
                        <EmbeddedCheckout />
                      </EmbeddedCheckoutProvider>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* Venue + Showtime */}
                    <div className="mb-7">
                      <p className="font-bebas text-bk-gold text-[14px] tracking-[0.15em]">
                        {venue.venue_name}
                      </p>
                      <p className="font-bebas text-bk-white text-[22px] leading-tight mt-0.5">
                        {formatDate(showtime.date)}
                      </p>
                      <p className="font-bebas text-bk-white text-[22px] leading-tight">
                        {formatTime(showtime.time)}
                      </p>
                      <p className="font-montserrat font-light text-white/25 text-[11px] mt-2">
                        {venue.address}, {venue.city}, {venue.state}
                      </p>
                    </div>

                    <div className="h-px bg-white/[0.04] mb-6" />

                    {/* Tickets */}
                    <div className="mb-6">
                      <p className="font-bebas text-white/25 text-[11px] tracking-[0.25em] mb-3">
                        TICKETS
                      </p>
                      <div className="flex items-center gap-5">
                        <motion.button
                          onClick={() => setQty(Math.max(1, qty - 1))}
                          className="w-9 h-9 flex items-center justify-center text-white/50 font-montserrat text-[16px] rounded-lg"
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}
                          whileHover={{ background: "rgba(255,255,255,0.07)" }}
                          whileTap={{ scale: 0.9 }}
                        >
                          &ndash;
                        </motion.button>
                        <span className="font-bebas text-bk-white text-[28px] w-6 text-center leading-none">
                          {qty}
                        </span>
                        <motion.button
                          onClick={() => setQty(Math.min(25, qty + 1))}
                          className="w-9 h-9 flex items-center justify-center text-white/50 font-montserrat text-[16px] rounded-lg"
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}
                          whileHover={{ background: "rgba(255,255,255,0.07)" }}
                          whileTap={{ scale: 0.9 }}
                        >
                          +
                        </motion.button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline justify-between mb-7">
                      <p className="font-montserrat text-white/20 text-[12px]">
                        ${price.toFixed(2)} &times; {qty}
                      </p>
                      <p className="font-bebas text-bk-gold text-[28px] leading-none">
                        ${total.toFixed(2)}
                      </p>
                    </div>

                    <div className="h-px bg-white/[0.04] mb-6" />

                    {/* Form */}
                    <GlassInput
                      label="FULL NAME"
                      value={fullName}
                      onChange={setFullName}
                      required
                    />
                    <GlassInput
                      label="EMAIL"
                      type="email"
                      value={email}
                      onChange={setEmail}
                      required
                      note="For ticket confirmation and seat selection."
                    />
                    <GlassInput
                      label="PHONE"
                      type="tel"
                      value={phone}
                      onChange={setPhone}
                      required
                      note="For show reminders and updates."
                    />

                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-montserrat text-red-400/80 text-[12px] mb-4"
                      >
                        {error}
                      </motion.p>
                    )}

                    {/* CTA */}
                    <motion.button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="w-full h-[50px] font-bebas text-[16px] tracking-[0.2em] rounded-lg disabled:opacity-40 transition-all duration-300 mt-2"
                      style={{
                        background: "rgba(240,201,58,0.9)",
                        color: "var(--bk-black)",
                        boxShadow: "0 2px 16px rgba(240,201,58,0.15)",
                      }}
                      whileHover={{
                        background: "rgba(240,201,58,1)",
                        boxShadow: "0 4px 24px rgba(240,201,58,0.25)",
                        y: -1,
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {submitting ? (
                        <div className="w-5 h-5 border-2 border-transparent border-t-bk-black rounded-full animate-spin mx-auto" />
                      ) : (
                        "CONTINUE TO PAYMENT"
                      )}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
