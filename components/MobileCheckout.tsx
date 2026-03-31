"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import type { Showtime, VenueGroup } from "./ShowtimeCard";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface MobileCheckoutProps {
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
        className="relative rounded-lg px-4 py-3.5 transition-all duration-300"
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
          className="w-full bg-transparent border-0 font-montserrat text-[15px] text-bk-white focus:outline-none placeholder:text-white/15"
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

export default function MobileCheckout({
  showtime,
  venue,
  onClose,
}: MobileCheckoutProps) {
  const [qty, setQty] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [checkoutData, setCheckoutData] = useState<{
    clientSecret: string;
    screening: { venue: string; date: string; time: string };
    qty: number;
    total: number;
  } | null>(null);

  const price = parseFloat(process.env.NEXT_PUBLIC_TICKET_PRICE || "18.00");
  const total = price * qty;

  const handleSubmit = async () => {
    if (!fullName.trim() || !email.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
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
    <AnimatePresence>
      {showtime && venue && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
            onClick={handleClose}
            style={{ background: "rgba(0,0,0,0.65)" }}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden rounded-t-2xl overflow-hidden"
            style={{
              maxHeight: "92vh",
              background:
                "linear-gradient(180deg, rgba(14,24,40,0.98) 0%, rgba(8,12,18,0.99) 100%)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Header with handle + close */}
            <div className="flex items-center justify-between px-6 pt-5 pb-3">
              <div className="flex items-center gap-3">
                {checkoutData ? (
                  <motion.button
                    onClick={handleBack}
                    className="w-8 h-8 flex items-center justify-center rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                    whileTap={{ scale: 0.85 }}
                    aria-label="Back"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </motion.button>
                ) : (
                  <div
                    className="w-8 h-1 rounded-full"
                    style={{ background: "rgba(255,255,255,0.12)" }}
                  />
                )}
              </div>
              <motion.button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-full"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                whileTap={{ scale: 0.85 }}
                aria-label="Close"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.button>
            </div>

            <div
              className="px-6 pb-10 overflow-y-auto"
              style={{ maxHeight: "calc(92vh - 56px)" }}
            >
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
                    <div className="mb-6">
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

                    <div className="h-px bg-white/[0.04] mb-5" />

                    {/* Tickets */}
                    <div className="mb-5">
                      <p className="font-bebas text-white/25 text-[11px] tracking-[0.25em] mb-3">
                        TICKETS
                      </p>
                      <div className="flex items-center gap-5">
                        <motion.button
                          onClick={() => setQty(Math.max(1, qty - 1))}
                          className="w-11 h-11 flex items-center justify-center text-white/50 font-montserrat text-[18px] rounded-lg"
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}
                          whileTap={{ scale: 0.88 }}
                        >
                          &ndash;
                        </motion.button>
                        <span className="font-bebas text-bk-white text-[30px] w-6 text-center leading-none">
                          {qty}
                        </span>
                        <motion.button
                          onClick={() => setQty(Math.min(25, qty + 1))}
                          className="w-11 h-11 flex items-center justify-center text-white/50 font-montserrat text-[18px] rounded-lg"
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                          }}
                          whileTap={{ scale: 0.88 }}
                        >
                          +
                        </motion.button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline justify-between mb-6">
                      <p className="font-montserrat text-white/20 text-[12px]">
                        ${price.toFixed(2)} &times; {qty}
                      </p>
                      <p className="font-bebas text-bk-gold text-[30px] leading-none">
                        ${total.toFixed(2)}
                      </p>
                    </div>

                    <div className="h-px bg-white/[0.04] mb-5" />

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
                      note="Optional — for show reminders."
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
                      className="w-full h-[54px] font-bebas text-[17px] tracking-[0.2em] rounded-lg disabled:opacity-40 transition-all duration-300 mt-2"
                      style={{
                        background: "rgba(240,201,58,0.9)",
                        color: "var(--bk-black)",
                        boxShadow: "0 2px 16px rgba(240,201,58,0.15)",
                      }}
                      whileTap={{ scale: 0.97 }}
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
