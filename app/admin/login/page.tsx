"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createAdminBrowserClient } from "@/lib/supabase-admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createAdminBrowserClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, rgba(19,34,64,0.4) 0%, #080c12 70%)",
      }}
    >
      <motion.form
        onSubmit={handleSubmit}
        animate={shake ? { x: [0, -8, 8, -8, 8, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[380px]"
      >
        <div className="text-center mb-10">
          <h1 className="font-bebas text-bk-gold text-[28px] tracking-[0.05em]">
            BILLY KNIGHT
          </h1>
          <p className="font-montserrat text-white/25 text-[12px] mt-1">
            Admin Access
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block font-montserrat font-medium text-white/30 text-[10px] tracking-[0.15em] mb-2">
              EMAIL
            </label>
            <div
              className="rounded-lg px-4 py-3 transition-all duration-300"
              style={{
                background: emailFocused
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(255,255,255,0.025)",
                border: emailFocused
                  ? "1px solid rgba(240,201,58,0.15)"
                  : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                required
                className="w-full bg-transparent border-0 font-montserrat text-[14px] text-bk-white focus:outline-none placeholder:text-white/15"
              />
            </div>
          </div>

          <div>
            <label className="block font-montserrat font-medium text-white/30 text-[10px] tracking-[0.15em] mb-2">
              PASSWORD
            </label>
            <div
              className="relative rounded-lg px-4 py-3 transition-all duration-300"
              style={{
                background: passFocused
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(255,255,255,0.025)",
                border: passFocused
                  ? "1px solid rgba(240,201,58,0.15)"
                  : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPassFocused(true)}
                onBlur={() => setPassFocused(false)}
                required
                className="w-full bg-transparent border-0 font-montserrat text-[14px] text-bk-white focus:outline-none placeholder:text-white/15 pr-8"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors"
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-montserrat text-red-400/80 text-[12px] mb-4"
          >
            {error}
          </motion.p>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full h-[48px] rounded-lg font-bebas text-[15px] tracking-[0.2em] disabled:opacity-40 transition-all duration-300"
          style={{
            background: "rgba(240,201,58,0.9)",
            color: "var(--bk-black)",
          }}
          whileHover={{
            background: "rgba(240,201,58,1)",
            boxShadow: "0 4px 24px rgba(240,201,58,0.2)",
          }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? "SIGNING IN..." : "SIGN IN"}
        </motion.button>
      </motion.form>
    </div>
  );
}
