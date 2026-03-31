"use client";

import { useEffect, useState } from "react";

interface Screening {
  id: string;
  venue_name: string;
  date: string;
  city: string;
  state: string;
}

interface Creator {
  slug: string;
  name: string;
}

export default function ReachOutPage() {
  const [audience, setAudience] = useState<"all" | "screening" | "creator">(
    "all"
  );
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [selectedScreening, setSelectedScreening] = useState("");
  const [selectedCreator, setSelectedCreator] = useState("");
  const [recipientCount, setRecipientCount] = useState(0);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loadingCount, setLoadingCount] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/screenings").then((r) => r.json()),
      fetch("/api/admin/creators").then((r) => r.json()),
    ]).then(([screeningsData, creatorsData]) => {
      setScreenings(screeningsData.screenings || []);
      setCreators(creatorsData.creators || []);
    });
  }, []);

  useEffect(() => {
    const fetchCount = async () => {
      setLoadingCount(true);
      const params = new URLSearchParams();

      if (audience === "screening" && selectedScreening) {
        params.set("screening_id", selectedScreening);
      } else if (audience === "creator" && selectedCreator) {
        params.set("referral_code", selectedCreator);
      }

      const res = await fetch(`/api/admin/tickets?${params}`);
      const data = await res.json();
      const tickets = data.tickets || [];
      const uniqueEmails = new Set(
        tickets.map((t: { email: string }) => t.email)
      );
      setRecipientCount(uniqueEmails.size);
      setLoadingCount(false);
    };

    fetchCount();
  }, [audience, selectedScreening, selectedCreator]);

  return (
    <div>
      <h1 className="font-montserrat font-medium text-white text-[13px] tracking-[0.2em] uppercase mb-6">
        Reach Out
      </h1>

      <div className="max-w-2xl">
        <div
          className="rounded-xl p-6 mb-6"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 2px 12px rgba(0,0,0,0.15)",
          }}
        >
          <h2 className="font-montserrat font-medium text-white/40 text-[10px] tracking-[0.2em] uppercase mb-4">
            Select Audience
          </h2>

          <div className="flex gap-2 mb-4">
            {(
              [
                { key: "all", label: "All Buyers" },
                { key: "screening", label: "By Screening" },
                { key: "creator", label: "By Creator" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.key}
                onClick={() => setAudience(opt.key)}
                className={`px-3 py-1.5 font-montserrat text-[12px] rounded-lg transition-colors ${
                  audience === opt.key
                    ? "text-white border border-white/15 bg-white/[0.08]"
                    : "text-white/40 border border-white/[0.06] hover:border-white/[0.12] hover:text-white/60"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {audience === "screening" && (
            <select
              value={selectedScreening}
              onChange={(e) => setSelectedScreening(e.target.value)}
              className="w-full px-3 py-2 font-montserrat text-[12px] rounded-xl outline-none mb-3"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "var(--bk-white)",
              }}
            >
              <option value="">Select screening...</option>
              {screenings.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.venue_name} — {s.city}, {s.state} ({s.date})
                </option>
              ))}
            </select>
          )}

          {audience === "creator" && (
            <select
              value={selectedCreator}
              onChange={(e) => setSelectedCreator(e.target.value)}
              className="w-full px-3 py-2 font-montserrat text-[12px] rounded-xl outline-none mb-3"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "var(--bk-white)",
              }}
            >
              <option value="">Select creator...</option>
              {creators.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} ({c.slug})
                </option>
              ))}
            </select>
          )}

          <p className="font-montserrat text-[13px] text-white/25">
            {loadingCount ? (
              "Loading..."
            ) : (
              <>
                <span className="text-bk-gold font-medium">
                  {recipientCount}
                </span>{" "}
                recipients selected
              </>
            )}
          </p>
        </div>

        <div
          className="rounded-xl p-6 mb-6"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 2px 12px rgba(0,0,0,0.15)",
          }}
        >
          <h2 className="font-montserrat font-medium text-white/40 text-[10px] tracking-[0.2em] uppercase mb-4">
            Compose
          </h2>

          <div className="mb-4">
            <label className="block font-montserrat font-medium text-[10px] text-white/30 tracking-wider uppercase mb-1">
              Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject..."
              className="w-full px-3 py-2 font-montserrat text-[13px] rounded-xl outline-none"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "var(--bk-white)",
              }}
            />
          </div>

          <div className="mb-4">
            <label className="block font-montserrat font-medium text-[10px] text-white/30 tracking-wider uppercase mb-1">
              Message
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message..."
              rows={8}
              className="w-full px-3 py-2 font-montserrat text-[13px] rounded-xl outline-none resize-y"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "var(--bk-white)",
              }}
            />
          </div>

          <div className="relative inline-block">
            <button
              disabled
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="px-6 py-3 font-montserrat font-medium text-[13px] tracking-[0.06em] text-white/90 rounded-lg cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 3px rgba(0,0,0,0.12)",
                opacity: 0.5,
              }}
            >
              SEND EMAIL
            </button>
            {showTooltip && (
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg whitespace-nowrap font-montserrat text-[11px]"
                style={{
                  background: "rgba(8,12,18,0.8)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "var(--bk-dim)",
                }}
              >
                Email sending coming soon — connect Resend to activate
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
