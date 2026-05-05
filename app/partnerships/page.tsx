"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
};

export default function PartnershipsPage() {
  const [form, setForm] = useState({
    name: "",
    business_name: "",
    email: "",
    phone: "",
    website: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/partnerships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Network error. Please try again.");
    }

    setSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-bk-black relative overflow-hidden">
      <div className="max-w-2xl mx-auto px-6 py-20 md:py-28">
        {/* Navigation */}
        <motion.div
          className="flex justify-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            href="/"
            className="font-montserrat font-light text-[11px] tracking-[0.15em] text-white/35 hover:text-white/70 transition-colors duration-300"
          >
            &larr; HOME
          </Link>
        </motion.div>

        {/* Hero title */}
        <motion.h1
          className="font-bebas text-center select-none uppercase"
          style={{
            fontSize: "clamp(48px, 10vw, 130px)",
            color: "white",
            textShadow: "0 4px 60px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.8)",
            lineHeight: 0.9,
            letterSpacing: "0.06em",
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          Billy Knight
        </motion.h1>

        {/* Subheader */}
        <motion.p
          className="font-montserrat text-center text-white/50 text-[11px] md:text-[12px] tracking-[0.25em] uppercase mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Partnership Opportunities
        </motion.p>

        {/* Body copy */}
        <motion.div
          className="max-w-lg mx-auto text-center mt-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <p className="font-montserrat text-white/65 text-[15px] leading-relaxed">
            Are you a small business owner — or know one?
          </p>
          <p className="font-montserrat text-white/65 text-[15px] leading-relaxed mt-3">
            We&rsquo;re creating opportunities to get involved with the film.
            Fill out the form below to learn more.
          </p>
        </motion.div>

        {/* Form / Success */}
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              className="text-center mt-16"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-bebas text-[24px] md:text-[28px] tracking-[0.1em] text-bk-gold">
                Thank you.
              </p>
              <p className="font-montserrat text-white/50 text-[14px] mt-3">
                We&rsquo;ll be in touch.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="mt-14 space-y-4 max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name *"
                required
                className="w-full px-5 py-3.5 rounded-xl font-montserrat text-[14px] text-white/80 placeholder:text-white/25 outline-none"
                style={inputStyle}
              />
              <input
                name="business_name"
                value={form.business_name}
                onChange={handleChange}
                placeholder="Business Name *"
                required
                className="w-full px-5 py-3.5 rounded-xl font-montserrat text-[14px] text-white/80 placeholder:text-white/25 outline-none"
                style={inputStyle}
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email *"
                required
                className="w-full px-5 py-3.5 rounded-xl font-montserrat text-[14px] text-white/80 placeholder:text-white/25 outline-none"
                style={inputStyle}
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone (optional)"
                className="w-full px-5 py-3.5 rounded-xl font-montserrat text-[14px] text-white/80 placeholder:text-white/25 outline-none"
                style={inputStyle}
              />
              <input
                name="website"
                value={form.website}
                onChange={handleChange}
                placeholder="Website / Social (optional)"
                className="w-full px-5 py-3.5 rounded-xl font-montserrat text-[14px] text-white/80 placeholder:text-white/25 outline-none"
                style={inputStyle}
              />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="What interests you about partnering with the film? *"
                required
                rows={4}
                className="w-full px-5 py-3.5 rounded-xl font-montserrat text-[14px] text-white/80 placeholder:text-white/25 outline-none resize-none"
                style={inputStyle}
              />

              {error && (
                <p className="font-montserrat text-[12px] text-red-400/80 text-center">
                  {error}
                </p>
              )}

              <motion.button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl font-bebas text-[16px] tracking-[0.15em] text-white uppercase mt-4 disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, rgba(240,201,58,0.2), rgba(240,201,58,0.1))",
                  border: "1px solid rgba(240,201,58,0.3)",
                  boxShadow: "0 0 20px rgba(240,201,58,0.06)",
                }}
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(240,201,58,0.1)" }}
                whileTap={{ scale: 0.98 }}
              >
                {submitting ? "Submitting..." : "Submit Inquiry"}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
