"use client";

import { motion } from "framer-motion";

interface DatePickerProps {
  dates: string[];
  selected: string;
  onSelect: (date: string) => void;
}

const TILE_W = 64;
const GAP = 4;

function parseDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const day = d.getDate();
  const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
  return { month, day, weekday };
}

export default function DatePicker({
  dates,
  selected,
  onSelect,
}: DatePickerProps) {
  const activeIndex = dates.indexOf(selected);

  return (
    <div
      className="relative flex gap-1 overflow-x-auto py-1 px-1 scrollbar-hide rounded-2xl"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.04)",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* Single sliding pill */}
      {activeIndex >= 0 && (
        <motion.div
          className="absolute top-1 left-1 pointer-events-none"
          style={{
            width: TILE_W,
            height: 80,
            borderRadius: 14,
          }}
          animate={{
            x: activeIndex * (TILE_W + GAP),
          }}
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 24,
            mass: 1,
          }}
        >
          {/* Glow layer */}
          <motion.div
            className="absolute -inset-1 rounded-[18px] pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.06) 0%, transparent 70%)",
            }}
            animate={{ opacity: [0, 1] }}
            transition={{ duration: 0.3 }}
          />
          {/* Glass surface */}
          <div
            className="absolute inset-0 rounded-[14px]"
            style={{
              background: "linear-gradient(165deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 16px -4px rgba(0,0,0,0.3)",
            }}
          />
        </motion.div>
      )}

      {dates.map((date) => {
        const { month, day, weekday } = parseDate(date);
        const isActive = date === selected;

        return (
          <button
            key={date}
            onClick={() => onSelect(date)}
            className="flex-shrink-0 flex flex-col items-center justify-center relative cursor-pointer hover:bg-white/[0.04] transition-colors duration-200"
            style={{
              width: TILE_W,
              height: 80,
              borderRadius: 14,
              border: "none",
              background: "transparent",
            }}
          >
            <span
              className={`font-montserrat font-semibold text-[9px] tracking-[0.1em] leading-none transition-colors duration-200 ${
                isActive ? "text-white/60" : "text-white/30"
              }`}
            >
              {month}
            </span>
            <span
              className={`font-montserrat font-bold text-[26px] leading-none mt-1 transition-colors duration-200 ${
                isActive ? "text-white" : "text-white/70"
              }`}
            >
              {day}
            </span>
            <span
              className={`font-montserrat font-medium text-[9px] leading-none mt-1 transition-colors duration-200 ${
                isActive ? "text-white/60" : "text-white/25"
              }`}
            >
              {weekday}
            </span>
          </button>
        );
      })}
    </div>
  );
}
