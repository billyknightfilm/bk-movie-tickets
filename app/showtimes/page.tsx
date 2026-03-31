"use client";

import { useState, useEffect, useCallback, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import SearchInput from "@/components/SearchInput";
import ShowtimeCard from "@/components/ShowtimeCard";
import DatePicker from "@/components/DatePicker";
import CheckoutPanel from "@/components/CheckoutPanel";
import MobileCheckout from "@/components/MobileCheckout";
import Footer from "@/components/Footer";
import type { Showtime, VenueGroup } from "@/components/ShowtimeCard";

function ShowtimesContent() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<VenueGroup[]>([]);
  const [nearestOutside, setNearestOutside] = useState<VenueGroup | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<VenueGroup | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      sessionStorage.setItem("bk_ref", ref);
    }
  }, [searchParams]);

  const allDates = useMemo(() => {
    const dateSet = new Set<string>();
    for (const venue of results) {
      for (const s of venue.showtimes) {
        dateSet.add(s.date);
      }
    }
    return Array.from(dateSet).sort();
  }, [results]);

  useEffect(() => {
    if (allDates.length > 0 && !allDates.includes(selectedDate)) {
      setSelectedDate(allDates[0]);
    }
  }, [allDates, selectedDate]);

  const filteredResults = useMemo(() => {
    if (!selectedDate) return [];
    return results
      .map((venue) => ({
        ...venue,
        filteredShowtimes: venue.showtimes.filter((s) => s.date === selectedDate),
      }))
      .filter((v) => v.filteredShowtimes.length > 0);
  }, [results, selectedDate]);

  const handleSearch = useCallback(async (query: string) => {
    setIsLoading(true);
    setHasSearched(true);
    setSelectedShowtime(null);
    setSelectedVenue(null);
    setSelectedDate("");
    try {
      const res = await fetch(`/api/showtimes?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
      setNearestOutside(data.nearest_outside_range || null);
    } catch {
      setResults([]);
    }
    setIsLoading(false);
  }, []);


  const handleSelect = useCallback(
    (showtime: Showtime, venue: VenueGroup) => {
      if (selectedShowtime?.id === showtime.id) {
        setSelectedShowtime(null);
        setSelectedVenue(null);
      } else {
        setSelectedShowtime(showtime);
        setSelectedVenue(venue);
      }
    },
    [selectedShowtime]
  );

  const handleCloseCheckout = useCallback(() => {
    setSelectedShowtime(null);
    setSelectedVenue(null);
  }, []);

  return (
    <main className="min-h-screen bg-bk-black relative">
      {/* Ambient background glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 60% 20%, rgba(26,74,122,0.1) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 30% 80%, rgba(19,34,64,0.15) 0%, transparent 60%)",
        }}
      />

      {/* DESKTOP */}
      <div className="hidden md:flex h-screen relative z-10">
        {/* Left: Poster */}
        <motion.div
          className="w-[300px] lg:w-[340px] h-screen flex-shrink-0 relative flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 120% 80% at 50% 40%, rgba(26,74,122,0.08) 0%, transparent 70%)",
            }}
          />

          <div className="relative w-[220px] lg:w-[260px] aspect-[2/3]">
            <Image
              src="/images/poster-BK.jpg"
              alt="Billy Knight"
              fill
              className="object-contain"
              priority
              sizes="260px"
            />
            <div
              className="absolute -inset-8 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(240,201,58,0.04) 0%, transparent 70%)",
              }}
            />
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-2.5 mt-7 relative z-10">
            {[
              {
                href: "https://instagram.com/billyknightmovie",
                label: "Instagram",
                icon: (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
                  </svg>
                ),
              },
              {
                href: "https://tiktok.com/@billyknightmovie",
                label: "TikTok",
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.21 8.21 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.14z" />
                  </svg>
                ),
              },
              {
                href: "https://youtube.com/@billyknightfilm",
                label: "YouTube",
                icon: (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.8 31.8 0 0 0 0 12a31.8 31.8 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.8 31.8 0 0 0 24 12a31.8 31.8 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
                  </svg>
                ),
              },
              {
                href: "https://x.com/bkmovie",
                label: "X",
                icon: (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                ),
              },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white/25 hover:text-white/60 transition-all duration-300 group"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 3px rgba(0,0,0,0.1)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <div className="relative w-px flex-shrink-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.06) 20%, rgba(240,201,58,0.08) 50%, rgba(255,255,255,0.06) 80%, transparent 100%)",
            }}
          />
        </div>

        {/* Right: Showtimes panel */}
        <motion.div
          className="flex-1 min-h-screen relative overflow-hidden"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.2,
          }}
        >
          <div className="relative z-10 flex h-screen">
            <div className="flex-1 flex flex-col px-6 lg:px-10 py-6 overflow-y-auto">
              {/* Top bar */}
              <div className="flex items-center justify-between mb-6">
                <Link
                  href="/"
                  className="font-montserrat font-light text-[11px] tracking-[0.15em] text-white/35 hover:text-white/70 transition-colors duration-300"
                >
                  &larr; HOME
                </Link>
                <Link
                  href="/"
                  className="font-montserrat font-light text-[11px] tracking-[0.15em] text-white/35 hover:text-bk-gold/80 transition-colors duration-300"
                >
                  FILM DETAILS &rarr;
                </Link>
              </div>

              {/* Search */}
              <div className="mb-6">
                <SearchInput onSearch={handleSearch} isLoading={isLoading} />
              </div>

              {/* Date picker */}
              {allDates.length > 0 && (
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <DatePicker
                    dates={allDates}
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                  />
                </motion.div>
              )}

              {/* Section label */}
              {filteredResults.length > 0 && (
                <motion.div
                  className="flex items-center gap-4 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <p className="font-bebas text-bk-gold/60 text-[12px] tracking-[0.25em] whitespace-nowrap">
                    SELECT A SHOWTIME
                  </p>
                  <div className="h-px flex-1 bg-gradient-to-r from-bk-gold/10 to-transparent" />
                </motion.div>
              )}

              {/* Results */}
              <motion.div layout className="flex-1 space-y-3 pb-4">
                <AnimatePresence mode="popLayout">
                  {filteredResults.map((venue, i) => (
                    <motion.div
                      key={`${venue.venue_name}-${venue.address}`}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
                      layout
                    >
                      <ShowtimeCard
                        venue={venue}
                        showtimes={venue.filteredShowtimes}
                        selectedId={selectedShowtime?.id ?? null}
                        onSelect={handleSelect}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {hasSearched && !isLoading && results.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-16 text-center"
                  >
                    <div
                      className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <p className="font-montserrat text-white/40 text-[15px] mb-1">
                      No screenings near you yet.
                    </p>
                    {nearestOutside && (
                      <button
                        onClick={() => handleSearch(nearestOutside.city)}
                        className="font-montserrat text-white/25 text-[13px] mt-3 hover:text-white/50 transition-colors duration-300 group"
                      >
                        Nearest screening:{" "}
                        <span className="text-bk-gold/70 group-hover:text-bk-gold underline underline-offset-2 decoration-bk-gold/30 group-hover:decoration-bk-gold/60 transition-all duration-300">
                          {nearestOutside.venue_name}
                        </span>
                        , {nearestOutside.city}, {nearestOutside.state} &mdash;{" "}
                        {nearestOutside.distance_miles} miles away
                      </button>
                    )}
                  </motion.div>
                )}

                {hasSearched &&
                  !isLoading &&
                  results.length > 0 &&
                  filteredResults.length === 0 &&
                  selectedDate && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="py-16 text-center"
                    >
                      <p className="font-montserrat text-white/35 text-[15px]">
                        No screenings on this date.
                      </p>
                      <p className="font-montserrat text-white/20 text-[13px] mt-1.5">
                        Try selecting another date above.
                      </p>
                    </motion.div>
                  )}
              </motion.div>

              <Footer />
            </div>

            {/* Checkout panel */}
            <CheckoutPanel
              showtime={selectedShowtime}
              venue={selectedVenue}
              onClose={handleCloseCheckout}
            />
          </div>
        </motion.div>
      </div>

      {/* MOBILE */}
      <div className="md:hidden min-h-screen relative z-10">
        <div className="fixed inset-0">
          <Image
            src="/images/blurred-poster.png"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, var(--bk-overlay), rgba(8,12,18,0.85))",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen px-5 py-6">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-7">
            <Link
              href="/"
              className="font-montserrat font-light text-[12px] tracking-[0.15em] text-white/35"
            >
              &larr; HOME
            </Link>
            <Link
              href="/"
              className="font-montserrat font-light text-[12px] tracking-[0.15em] text-white/35"
            >
              FILM DETAILS &rarr;
            </Link>
          </div>

          {/* Search */}
          <div className="mb-6">
            <SearchInput onSearch={handleSearch} isLoading={isLoading} />
          </div>

          {/* Date picker */}
          {allDates.length > 0 && (
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <DatePicker
                dates={allDates}
                selected={selectedDate}
                onSelect={setSelectedDate}
              />
            </motion.div>
          )}

          {/* Section label */}
          {filteredResults.length > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <p className="font-bebas text-bk-gold/60 text-[11px] tracking-[0.25em] whitespace-nowrap">
                SELECT A SHOWTIME
              </p>
              <div className="h-px flex-1 bg-gradient-to-r from-bk-gold/10 to-transparent" />
            </div>
          )}

          {/* Results */}
          <motion.div layout className="flex-1 space-y-3 pb-4">
            <AnimatePresence mode="popLayout">
              {filteredResults.map((venue, i) => (
                <motion.div
                  key={`${venue.venue_name}-${venue.address}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ delay: i * 0.06, duration: 0.35, ease: "easeOut" }}
                  layout
                >
                  <ShowtimeCard
                    venue={venue}
                    showtimes={venue.filteredShowtimes}
                    selectedId={selectedShowtime?.id ?? null}
                    onSelect={handleSelect}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {hasSearched && !isLoading && results.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-12 text-center"
              >
                <div
                  className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <p className="font-montserrat text-white/40 text-[15px]">
                  No screenings near you yet.
                </p>
                {nearestOutside && (
                  <button
                    onClick={() => handleSearch(nearestOutside.city)}
                    className="font-montserrat text-white/25 text-[13px] mt-3 group"
                  >
                    Nearest:{" "}
                    <span className="text-bk-gold/70 group-hover:text-bk-gold underline underline-offset-2 decoration-bk-gold/30 transition-all">
                      {nearestOutside.venue_name}
                    </span>
                    , {nearestOutside.city}, {nearestOutside.state} &mdash;{" "}
                    {nearestOutside.distance_miles} mi
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>

          <Footer />
        </div>

        <MobileCheckout
          showtime={selectedShowtime}
          venue={selectedVenue}
          onClose={handleCloseCheckout}
        />
      </div>
    </main>
  );
}

export default function ShowtimesPage() {
  return (
    <Suspense>
      <ShowtimesContent />
    </Suspense>
  );
}
