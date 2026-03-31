"use client";

import Link from "next/link";
import { useState } from "react";

const socials = [
  {
    href: "https://instagram.com/billyknightmovie",
    label: "Instagram",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.21 8.21 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.14z" />
      </svg>
    ),
  },
  {
    href: "https://youtube.com/@billyknightmovie",
    label: "YouTube",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.8 31.8 0 0 0 0 12a31.8 31.8 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.8 31.8 0 0 0 24 12a31.8 31.8 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
      </svg>
    ),
  },
  {
    href: "https://x.com/bkmovie",
    label: "X",
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = "https://billyknightmovie.com";
    if (navigator.share) {
      try {
        await navigator.share({ title: "Billy Knight", url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer
      className="rounded-2xl px-4 sm:px-6 py-5 mt-auto"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.05)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 2px 12px rgba(0,0,0,0.15)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4 order-first sm:order-last">
          <div className="flex items-center gap-1">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/20 hover:text-white/50 hover:bg-white/[0.04] transition-all duration-300"
              >
                {s.icon}
              </a>
            ))}
          </div>

          <div className="w-px h-4 bg-white/[0.06]" />

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 font-montserrat font-medium text-[11px] text-white/20 hover:text-white/50 transition-all duration-300"
          >
            {copied ? (
              <span className="text-white/40">Copied!</span>
            ) : (
              <>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
                Share
              </>
            )}
          </button>
        </div>

        <p className="font-montserrat font-medium text-[11px] text-white/25 tracking-[0.04em]">
          &copy; 2026 Billy Knight Film
        </p>
      </div>

      <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <Link
          href="/privacy"
          className="font-montserrat font-medium text-[10px] text-white/15 hover:text-white/40 tracking-[0.04em] transition-colors duration-300"
        >
          Privacy Policy
        </Link>
        <span className="text-white/10 text-[10px]" aria-hidden="true">&middot;</span>
        <Link
          href="/terms"
          className="font-montserrat font-medium text-[10px] text-white/15 hover:text-white/40 tracking-[0.04em] transition-colors duration-300"
        >
          Terms of Use
        </Link>
      </div>
    </footer>
  );
}
