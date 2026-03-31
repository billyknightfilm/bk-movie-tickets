"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface SearchInputProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  initialValue?: string;
}

export default function SearchInput({ onSearch, isLoading, initialValue }: SearchInputProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialValue) setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = () => {
    const q = value.trim();
    if (q) onSearch(q);
  };

  return (
    <div className="relative" style={{ borderRadius: 14 }}>
      {/* Outer glow on focus */}
      <motion.div
        className="absolute -inset-px rounded-[15px] pointer-events-none"
        animate={{
          opacity: focused ? 1 : 0,
          boxShadow: focused
            ? "0 0 0 1px rgba(240,201,58,0.12), 0 0 24px -4px rgba(240,201,58,0.08)"
            : "none",
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      <div
        className="relative flex items-center gap-3 w-full pl-5 pr-2 py-2"
        style={{
          background: focused
            ? "rgba(255,255,255,0.04)"
            : "rgba(255,255,255,0.025)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          borderRadius: 14,
          border: focused
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(255,255,255,0.05)",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.03), 0 2px 12px rgba(0,0,0,0.15)",
          transition: "background 0.35s ease, border-color 0.35s ease",
        }}
      >
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0"
          animate={{
            stroke: focused ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.2)",
          }}
          transition={{ duration: 0.35 }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </motion.svg>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="City or zip code"
          className="flex-1 min-w-0 bg-transparent border-0 font-montserrat text-[14px] text-white/90 placeholder:text-white/20 focus:outline-none py-1.5"
        />

        {isLoading ? (
          <div className="w-5 h-5 border-2 border-transparent border-t-white/40 rounded-full animate-spin flex-shrink-0 mr-2" />
        ) : (
          value.trim() && (
            <motion.button
              onClick={handleSubmit}
              className="flex-shrink-0 font-montserrat text-[12px] sm:text-[13px] font-medium tracking-[0.01em] text-white/80"
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.12)",
              }}
              whileHover={{
                color: "rgba(255,255,255,0.95)",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)",
                borderColor: "rgba(255,255,255,0.14)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.2)",
              }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              Search
            </motion.button>
          )
        )}
      </div>
    </div>
  );
}
