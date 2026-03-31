"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { createAdminBrowserClient } from "@/lib/supabase-admin";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Venues",
    href: "/admin/screenings",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: "Tickets",
    href: "/admin/tickets",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <path d="M13 5v2" />
        <path d="M13 17v2" />
        <path d="M13 11v2" />
      </svg>
    ),
  },
  {
    label: "Revenue",
    href: "/admin/revenue",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    label: "Creators",
    href: "/admin/creators",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
      </svg>
    ),
  },
  {
    label: "Reach Out",
    href: "/admin/reach-out",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleSignOut = async () => {
    const supabase = createAdminBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bk-black">
      <aside className="w-[240px] flex-shrink-0 flex flex-col h-screen fixed left-0 top-0 z-50 overflow-hidden">
        {/* Layered cinematic background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d1a2d] via-[#080d15] to-[#050810]" />
        <div className="absolute inset-0 bg-gradient-to-br from-bk-gold/[0.015] via-transparent to-transparent" />
        <div className="absolute inset-0 sidebar-noise" />

        {/* Ambient gold glow at top */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-bk-gold/[0.035] blur-3xl pointer-events-none" />

        {/* Right edge gradient border */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-bk-gold/[0.08] via-white/[0.04] to-transparent" />

        {/* Content layer */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Logo / Brand */}
          <motion.div
            className="px-6 pt-7 pb-5"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/admin" className="group flex items-center gap-3.5">
              <motion.div
                className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
                whileHover={{ scale: 1.06, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Image
                  src="/images/favicon.png"
                  alt="Billy Knight"
                  fill
                  className="object-cover"
                  sizes="40px"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.08] rounded-xl group-hover:ring-bk-gold/20 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
              </motion.div>
              <div className="flex flex-col min-w-0">
                <span className="font-dancing text-bk-gold text-xl leading-tight tracking-wide group-hover:text-bk-gold/80 transition-colors duration-500">
                  Billy Knight
                </span>
                <span className="font-montserrat text-[9px] text-white/20 tracking-[0.2em] uppercase font-medium mt-0.5">
                  Admin Panel
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Gradient divider */}
          <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-[3px] px-3 mt-5 overflow-y-auto scrollbar-hide">
            <motion.div
              className="px-3 mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="font-montserrat text-[9px] tracking-[0.25em] text-white/[0.12] uppercase font-medium">
                Navigation
              </span>
            </motion.div>

            {navItems.map((item, i) => {
              const active = isActive(item.href);
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1 + i * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link href={item.href} className="block">
                    <div
                      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${
                        active
                          ? "text-white"
                          : "text-white/30 hover:text-white/60"
                      }`}
                    >
                      {/* Active pill background - animated between items */}
                      {active && (
                        <motion.div
                          layoutId="sidebar-active-bg"
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(240,201,58,0.06) 0%, rgba(255,255,255,0.02) 100%)",
                            boxShadow:
                              "inset 0 0 0 1px rgba(240,201,58,0.07), 0 2px 20px -8px rgba(240,201,58,0.08)",
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 32,
                          }}
                        />
                      )}

                      {/* Hover background for inactive items */}
                      {!active && (
                        <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/[0.025] transition-colors duration-300" />
                      )}

                      {/* Gold accent bar */}
                      {active && (
                        <motion.div
                          layoutId="sidebar-active-bar"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[2.5px] h-4 rounded-full bg-bk-gold"
                          style={{
                            animation: "accent-pulse 3s ease-in-out infinite",
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 32,
                          }}
                        />
                      )}

                      {/* Icon */}
                      <span
                        className={`relative z-10 flex-shrink-0 transition-all duration-300 ${
                          active
                            ? "text-bk-gold/70"
                            : "text-white/[0.12] group-hover:text-white/30"
                        }`}
                      >
                        {item.icon}
                      </span>

                      {/* Label */}
                      <span
                        className={`relative z-10 font-montserrat text-[13px] transition-all duration-300 ${
                          active ? "font-medium" : "font-normal"
                        }`}
                      >
                        {item.label}
                      </span>

                      {/* Active dot (right side) */}
                      {active && (
                        <motion.div
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-bk-gold/50"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 0.1,
                            type: "spring",
                            stiffness: 500,
                          }}
                        />
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="px-3 pb-6 mt-auto">
            <div className="mx-2 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent mb-3" />

            <motion.button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-white/[0.15] hover:text-white/40 transition-all duration-300 group"
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0 transition-colors duration-300 text-white/[0.12] group-hover:text-white/25"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="font-montserrat text-[12px] tracking-wide">
                Sign out
              </span>
            </motion.button>

            <div className="px-3 pt-3">
              <p className="font-montserrat text-[8px] text-white/[0.06] tracking-[0.2em] uppercase select-none">
                &copy; 2026 Billy Knight Film
              </p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-[240px] overflow-y-auto p-8">{children}</main>
    </div>
  );
}
