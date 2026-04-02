"use client";

import { motion } from "framer-motion";

export interface Showtime {
  id: string;
  date: string;
  time: string;
  capacity: number;
  tickets_sold: number;
  available: number;
}

export interface VenueGroup {
  venue_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  distance_miles: number;
  showtimes: Showtime[];
}

interface ShowtimeCardProps {
  venue: VenueGroup;
  showtimes: Showtime[];
  selectedId: string | null;
  onSelect: (showtime: Showtime, venue: VenueGroup) => void;
  isPremiere?: boolean;
}

function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${m} ${ampm}`;
}

export default function ShowtimeCard({
  venue,
  showtimes,
  selectedId,
  onSelect,
  isPremiere = false,
}: ShowtimeCardProps) {
  return (
    <motion.div
      layout
      className="rounded-2xl px-6 py-5 md:px-7 md:py-6 relative overflow-hidden group"
      style={{
        background: isPremiere
          ? "linear-gradient(135deg, rgba(195,170,90,0.05) 0%, rgba(140,115,45,0.03) 100%)"
          : "linear-gradient(135deg, rgba(19,34,64,0.5) 0%, rgba(11,21,37,0.6) 100%)",
        border: isPremiere
          ? "1px solid rgba(195,170,90,0.10)"
          : "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(40px)",
        WebkitBackdropFilter: "blur(40px)",
        boxShadow: isPremiere
          ? "0 2px 16px rgba(140,115,45,0.06), 0 8px 48px rgba(140,115,45,0.03), inset 0 1px 0 rgba(232,213,163,0.06)"
          : "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
      whileHover={{
        borderColor: isPremiere
          ? "rgba(195,170,90,0.18)"
          : "rgba(255,255,255,0.1)",
        boxShadow: isPremiere
          ? "0 4px 24px rgba(140,115,45,0.08), 0 12px 64px rgba(140,115,45,0.05), 0 0 0 1px rgba(195,170,90,0.12), inset 0 1px 0 rgba(232,213,163,0.08)"
          : "0 8px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
      transition={{ duration: 0.25 }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: isPremiere
            ? "radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(195,170,90,0.035), transparent 50%)"
            : "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(240,201,58,0.03), transparent 40%)",
        }}
      />

      <div className="flex items-start justify-between gap-4 mb-5 relative z-10">
        <div>
          <h3 className="font-montserrat font-semibold text-white text-[16px] md:text-[17px] leading-tight tracking-[-0.01em]">
            {venue.venue_name}
          </h3>
          <p className="font-montserrat font-light text-white/30 text-[12px] mt-1.5 flex items-center gap-1.5">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0 opacity-50"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {venue.address}, {venue.city}, {venue.state}
            <span className="text-white/25">&middot;</span>
            <span>{venue.distance_miles} mi</span>
          </p>
        </div>

        {isPremiere ? (
          <span
            className="font-bebas font-medium text-[11px] tracking-[0.18em] px-3 py-1 rounded-full flex-shrink-0 mt-1"
            style={{
              background: "rgba(195,170,90,0.08)",
              border: "1px solid rgba(195,170,90,0.12)",
              color: "#C9A84C",
            }}
          >
            PREMIERE
          </span>
        ) : (
          <span
            className="font-montserrat font-medium text-white/45 text-[11px] px-2.5 py-1 rounded-full flex-shrink-0 mt-1"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {venue.distance_miles} mi
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5 relative z-10">
        {showtimes.map((s) => {
          const soldOut = s.tickets_sold >= s.capacity;
          const isSelected = selectedId === s.id;

          return (
            <motion.button
              key={s.id}
              onClick={() => !soldOut && onSelect(s, venue)}
              disabled={soldOut}
              className={`px-5 py-2.5 rounded-xl font-bebas text-[15px] tracking-wider transition-all duration-200 ${
                soldOut
                  ? "text-white/15 cursor-not-allowed"
                  : isSelected
                    ? "text-white"
                    : "text-white/75 hover:text-white"
              }`}
              style={
                soldOut
                  ? {
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.03)",
                    }
                  : isSelected
                    ? {
                        background:
                          "linear-gradient(135deg, rgba(240,201,58,0.2), rgba(240,201,58,0.1))",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "1px solid rgba(240,201,58,0.35)",
                        boxShadow:
                          "0 0 24px rgba(240,201,58,0.12), 0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                      }
                    : {
                        background: "rgba(255,255,255,0.04)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        boxShadow:
                          "inset 0 1px 0 rgba(255,255,255,0.04), 0 2px 8px rgba(0,0,0,0.1)",
                      }
              }
              whileHover={
                !soldOut && !isSelected
                  ? {
                      background: "rgba(255,255,255,0.07)",
                      borderColor: "rgba(255,255,255,0.14)",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.15)",
                      y: -1,
                    }
                  : {}
              }
              whileTap={!soldOut ? { scale: 0.97 } : {}}
              transition={{ duration: 0.2 }}
            >
              {soldOut ? "SOLD OUT" : formatTime(s.time)}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
