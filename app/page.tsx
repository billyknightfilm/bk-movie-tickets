"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import { trackViewContent, trackInitiateCheckout } from "@/lib/tiktok-pixel";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, ease: "easeOut" as const },
};

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const viewTracked = useRef(false);

  useEffect(() => {
    if (!viewTracked.current) {
      viewTracked.current = true;
      trackViewContent();
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const titleScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.6]);
  const titleY = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.25, 0.45], [1, 0.5, 0]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const subtitleY = useTransform(scrollYProgress, [0, 0.3], [0, -40]);
  const buttonOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const buttonY = useTransform(scrollYProgress, [0, 0.25], [0, -30]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.08], [0.5, 0]);

  const handleWatchTrailer = () => {
    setShowTrailer(true);
  };

  return (
    <main className="min-h-screen bg-bk-black overflow-x-hidden">
      {/* ── HERO: FULL-SCREEN VIDEO ── */}
      <section ref={heroRef} className="relative w-screen h-[120vh]">
        <div className="sticky top-0 w-screen h-screen overflow-hidden">
          <video
            ref={videoRef}
            src="/images/teaser-Background.MOV"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Gradient overlays — strong bottom fade for seamless transition */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-bk-black pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-bk-black via-bk-black/80 to-transparent pointer-events-none" />

          {/* Top bar */}
          <motion.div
            className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-10 py-5"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Link href="/" className="font-montserrat font-medium text-white/70 text-[13px] tracking-[0.08em] hover:text-white transition-colors duration-300">
              BILLY KNIGHT
            </Link>
            <Link
              href="/showtimes"
              onClick={trackInitiateCheckout}
              className="px-5 py-2 rounded-xl font-montserrat font-medium text-[12px] tracking-[0.06em] text-white/90 transition-all duration-300 hover:text-white"
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 1px 3px rgba(0,0,0,0.15)",
              }}
            >
              GET TICKETS
            </Link>
          </motion.div>

          {/* Centered content overlay */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
            <motion.h1
              className="font-bebas text-center select-none uppercase will-change-transform"
              style={{
                fontSize: "clamp(72px, 14vw, 180px)",
                color: "white",
                textShadow: "0 4px 60px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.8)",
                lineHeight: 0.9,
                letterSpacing: "0.06em",
                scale: titleScale,
                y: titleY,
                opacity: titleOpacity,
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              Billy Knight
            </motion.h1>

            <motion.p
              className="font-montserrat font-medium text-white/80 text-center mt-7 tracking-[0.15em] sm:tracking-[0.2em] uppercase will-change-transform px-6"
              style={{
                fontSize: "clamp(12px, 1.5vw, 17px)",
                opacity: subtitleOpacity,
                y: subtitleY,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              In Select Theaters &nbsp;&middot;&nbsp; August 21, 2026
            </motion.p>

            <motion.button
              onClick={handleWatchTrailer}
              className="mt-10 flex items-center gap-3 px-8 py-3 rounded-xl transition-all duration-300 will-change-transform"
              style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 1px 3px rgba(0,0,0,0.15)",
                opacity: buttonOpacity,
                y: buttonY,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.7 }}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              <svg width="10" height="12" viewBox="0 0 10 12" fill="white">
                <polygon points="0,0 10,6 0,12" />
              </svg>
              <span className="font-montserrat font-medium text-white text-[12px] tracking-[0.12em]">
                Watch Teaser
              </span>
            </motion.button>
          </div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
            style={{ opacity: scrollIndicatorOpacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 2.5, duration: 1 }}
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <svg width="18" height="24" viewBox="0 0 18 24" fill="none" stroke="white" strokeWidth="1.5">
                <path d="M9 4v8M5 10l4 4 4-4" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT THE FILM ── */}
      <motion.section className="py-10 md:py-14 px-6 md:px-12 lg:px-20" {...fadeUp}>
        <div className="max-w-[1100px] mx-auto">
          {/* Section label */}
          <div className="flex items-center gap-5 mb-8 md:mb-10">
            <h2 className="font-montserrat font-medium text-white text-[13px] tracking-[0.2em] uppercase whitespace-nowrap">
              About the Film
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/[0.08] to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr_200px] gap-10 md:gap-14 items-start">
            {/* Poster */}
            <div className="flex flex-col items-center md:items-start">
              <div
                className="relative w-[220px] md:w-[260px] aspect-[2/3] rounded-lg overflow-hidden"
                style={{
                  boxShadow: "0 8px 40px -8px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
                }}
              >
                <Image
                  src="/images/poster-BK.jpg"
                  alt="Billy Knight"
                  fill
                  className="object-cover"
                  sizes="260px"
                />
              </div>
            </div>

            {/* Synopsis */}
            <div className="flex flex-col justify-start">
              <p className="font-montserrat text-white/80 text-[15px] md:text-[16px] leading-[1.85] font-light">
                After losing his father, Alex discovers a box of unfinished scripts
                and a handkerchief with the name &ldquo;Billy Knight&rdquo;
                embroidered on it. Consumed with the desire to discover his
                identity, Alex embarks on a Hollywood adventure to track down this
                mysterious and reclusive Billy Knight&nbsp;&mdash; navigating the
                fine line between fiction and reality.
              </p>
            </div>

            {/* Credits */}
            <div className="flex flex-col gap-7">
              <div>
                <p className="font-montserrat font-medium text-white/40 text-[10px] tracking-[0.2em] uppercase mb-2">
                  Written &amp; Directed by
                </p>
                <p className="font-montserrat text-white/75 text-[14px] leading-relaxed">
                  Alec Griffen Roth
                </p>
              </div>
              <div>
                <p className="font-montserrat font-medium text-white/40 text-[10px] tracking-[0.2em] uppercase mb-2">
                  Starring
                </p>
                <p className="font-montserrat text-white/75 text-[14px] leading-[1.8]">
                  Al Pacino, Charlie Heaton, Diana Silvers, Angela Sarafyan, Sara Sampaio, Rick Ross, Diplo, Elsie, Beck
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── BOTTOM CTA ── */}
      <motion.section
        className="py-10 md:py-14 flex flex-col items-center gap-4 px-6"
        {...fadeUp}
      >
        <p className="font-montserrat font-medium text-white/30 text-[11px] tracking-[0.25em] uppercase">
          Now Booking
        </p>
        <Link
          href="/showtimes"
          onClick={trackInitiateCheckout}
          className="px-10 py-3.5 rounded-xl font-montserrat font-medium text-[14px] tracking-[0.1em] text-white/90 transition-all duration-300 hover:text-white hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 2px 12px rgba(0,0,0,0.2)",
          }}
        >
          GET TICKETS
        </Link>
      </motion.section>

      {/* Footer */}
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 pb-6">
        <Footer />
      </div>

      {/* Trailer modal overlay */}
      <AnimatePresence>
        {showTrailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black flex items-center justify-center"
            onClick={() => setShowTrailer(false)}
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-xl z-10 transition-all duration-300 hover:bg-white/10"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <video
              src="/images/trailer.MOV"
              autoPlay
              controls
              playsInline
              className="w-full h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
