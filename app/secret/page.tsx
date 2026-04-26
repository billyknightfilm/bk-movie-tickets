"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type Phase = "input" | "transition" | "reveal";

const CORRECT_PASSWORD = "music";
const LINES = ["Lesley Barber.", "Every Living Breathing Moment by Grant Steller."];
const TYPE_SPEED = 60;
const LINE_PAUSE = 400;

export default function SecretPage() {
  const [phase, setPhase] = useState<Phase>("input");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [typed, setTyped] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(() => {
    if (!password.trim()) return;

    if (password.toLowerCase() === CORRECT_PASSWORD) {
      setPhase("transition");
    } else {
      setError(true);
      setShaking(true);
      setPassword("");
      setTimeout(() => setShaking(false), 400);
      setTimeout(() => setError(false), 1500);
    }
  }, [password]);

  useEffect(() => {
    if (phase !== "reveal") return;

    const fullText = LINES[0] + "\n" + LINES[1];
    let i = 0;
    let paused = false;

    const interval = setInterval(() => {
      if (paused) return;

      if (i <= fullText.length) {
        setTyped(fullText.slice(0, i));
        if (fullText[i - 1] === "\n" && !paused) {
          paused = true;
          setTimeout(() => {
            paused = false;
          }, LINE_PAUSE);
        }
        i++;
      } else {
        clearInterval(interval);
        setTypingDone(true);
      }
    }, TYPE_SPEED);

    return () => clearInterval(interval);
  }, [phase]);

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: "#080c12" }}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-6px); }
          30% { transform: translateX(5px); }
          45% { transform: translateX(-4px); }
          60% { transform: translateX(3px); }
          75% { transform: translateX(-2px); }
        }
      `}</style>

      <AnimatePresence mode="wait">
        {(phase === "input" || phase === "transition") && (
          <motion.div
            key="vinyl-phase"
            className="flex flex-col items-center justify-center min-h-screen px-6"
            exit={{ opacity: 0 }}
            transition={{ duration: 0 }}
          >
            {/* Vinyl record */}
            <motion.div
              className="relative w-[240px] h-[240px] md:w-[320px] md:h-[320px]"
              animate={
                phase === "transition"
                  ? { scale: 18 }
                  : { scale: 1 }
              }
              transition={
                phase === "transition"
                  ? { duration: 3.5, ease: "easeInOut" }
                  : {}
              }
              onAnimationComplete={() => {
                if (phase === "transition") setPhase("reveal");
              }}
              style={{ animation: phase === "input" ? "spin 2.5s linear infinite" : undefined }}
            >
              <Image
                src="/images/vinyl.png"
                alt=""
                width={320}
                height={320}
                className="w-full h-full"
                priority
                style={{
                  animation: phase === "transition" ? "spin 2.5s linear infinite" : undefined,
                }}
              />

              {/* Smooth grey center covering the white spindle hole */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: "8%",
                  height: "8%",
                  background: "radial-gradient(circle, #3a3a3a 0%, #2a2a2a 50%, #1e1e1e 100%)",
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,0.08), 0 0 4px rgba(0,0,0,0.5)",
                }}
              />

              {/* Black overlay that fades in during zoom to ensure screen goes fully black */}
              <motion.div
                className="absolute inset-0 rounded-full"
                initial={{ opacity: 0 }}
                animate={phase === "transition" ? { opacity: 1 } : { opacity: 0 }}
                transition={phase === "transition" ? { duration: 2, delay: 1.5, ease: "easeIn" } : {}}
                style={{ background: "#000" }}
              />
            </motion.div>

            {/* Password input */}
            <AnimatePresence>
              {phase === "input" && (
                <motion.div
                  className="mt-10 flex flex-col items-center"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <input
                    ref={inputRef}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="password"
                    autoFocus
                    className="w-[260px] md:w-[280px] px-5 py-3 text-center font-mono text-[14px] text-white/80 placeholder:text-white/20 outline-none rounded-xl"
                    style={{
                      background: "rgba(195,170,90,0.08)",
                      border: error
                        ? "1px solid rgba(220,60,60,0.6)"
                        : "1px solid rgba(195,170,90,0.15)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      animation: shaking ? "shake 0.4s ease-out" : undefined,
                      transition: "border-color 0.3s ease",
                    }}
                  />
                  <div className="h-6 mt-3">
                    <AnimatePresence>
                      {error && (
                        <motion.p
                          className="font-mono text-[11px] tracking-[0.08em]"
                          style={{ color: "rgba(220,60,60,0.7)" }}
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          incorrect password
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {phase === "reveal" && (
          <motion.div
            key="reveal-phase"
            className="flex flex-col items-center justify-center min-h-screen px-6"
            initial={{ backgroundColor: "#000" }}
            animate={{ backgroundColor: "#080c12" }}
            transition={{ duration: 1.5, delay: 0.5 }}
          >
            <div className="text-center">
              {typed.split("\n").map((line, i) => (
                <p
                  key={i}
                  className="font-bebas text-[20px] md:text-[26px] tracking-[0.12em] leading-relaxed"
                  style={{ color: "#D4AF37", minHeight: "1.6em" }}
                >
                  {line}
                  {!typingDone && i === typed.split("\n").length - 1 && line.length > 0 && (
                    <span
                      className="inline-block w-[2px] h-[1em] ml-1 align-middle"
                      style={{
                        background: "#D4AF37",
                        animation: "blink 0.8s step-end infinite",
                      }}
                    />
                  )}
                </p>
              ))}
            </div>

            <AnimatePresence>
              {typingDone && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="mt-12"
                >
                  <Link
                    href="/"
                    className="font-montserrat text-[10px] tracking-[0.2em] text-white/25 hover:text-white/50 transition-colors duration-300"
                  >
                    &larr; HOME
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </main>
  );
}
