"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Stats {
  totalTicketsSold: number;
  totalRevenue: number;
  activeScreenings: number;
  topCreator: { name: string; tickets: number } | null;
  ticketsPerDay: { date: string; count: number }[];
  recentTickets: {
    id: string;
    ticket_number: string;
    full_name: string;
    quantity: number;
    price_total: number;
    status: string;
    created_at: string;
    screening: {
      venue_name: string;
      date: string;
      time: string;
    } | null;
  }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-5 h-5 border-2 border-transparent border-t-bk-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    { label: "Tickets Sold", value: stats.totalTicketsSold.toLocaleString() },
    { label: "Revenue", value: `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}` },
    { label: "Active Screenings", value: stats.activeScreenings.toLocaleString() },
    { label: "Top Creator", value: stats.topCreator?.name || "—" },
  ];

  return (
    <div>
      <h1 className="font-montserrat font-medium text-white text-[13px] tracking-[0.2em] uppercase mb-6">
        Dashboard
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className="p-5 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.05)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 2px 12px rgba(0,0,0,0.15)",
            }}
          >
            <p className="font-montserrat font-semibold text-white text-[26px] leading-none">
              {card.value}
            </p>
            <p className="font-montserrat text-white/25 text-[11px] mt-2">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      {stats.ticketsPerDay.length > 0 && (
        <div
          className="p-6 rounded-xl mb-8"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 2px 12px rgba(0,0,0,0.15)",
          }}
        >
          <h2 className="font-montserrat font-medium text-white/40 text-[10px] tracking-[0.2em] uppercase mb-5">
            TICKETS PER DAY
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={stats.ticketsPerDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 11, fontFamily: "var(--font-montserrat)" }}
                tickFormatter={(v) =>
                  new Date(v + "T00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
                axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 11, fontFamily: "var(--font-montserrat)" }}
                axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(8,12,18,0.95)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 8,
                  fontSize: 12,
                  fontFamily: "var(--font-montserrat)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}
                labelStyle={{ color: "rgba(255,255,255,0.3)" }}
                itemStyle={{ color: "#f0c93a" }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#f0c93a"
                strokeWidth={2}
                dot={{ r: 3, fill: "#f0c93a", strokeWidth: 0 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent tickets */}
      <div
        className="p-6 rounded-xl"
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 2px 12px rgba(0,0,0,0.15)",
        }}
      >
        <h2 className="font-montserrat font-medium text-white/40 text-[10px] tracking-[0.2em] uppercase mb-5">
          RECENT TICKETS
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/[0.04]">
                {["Ticket #", "Name", "Screening", "Qty", "Total", "Status", "Date"].map((h) => (
                  <th key={h} className="font-montserrat font-medium text-[10px] text-white/20 tracking-[0.1em] pb-3 pr-4 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recentTickets.map((t) => (
                <tr key={t.id} className="border-b border-white/[0.02] hover:bg-white/[0.015] transition-colors duration-200">
                  <td className="font-montserrat text-[13px] text-bk-gold py-3.5 pr-4">{t.ticket_number}</td>
                  <td className="font-montserrat text-[13px] text-white/70 py-3.5 pr-4">{t.full_name}</td>
                  <td className="font-montserrat text-[12px] text-white/25 py-3.5 pr-4">{t.screening?.venue_name || "—"}</td>
                  <td className="font-montserrat text-[13px] text-white/50 py-3.5 pr-4">{t.quantity}</td>
                  <td className="font-montserrat text-[13px] text-white/50 py-3.5 pr-4">${Number(t.price_total).toFixed(2)}</td>
                  <td className="py-3.5 pr-4"><StatusBadge status={t.status} /></td>
                  <td className="font-montserrat text-[12px] text-white/20 py-3.5">{new Date(t.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {stats.recentTickets.length === 0 && (
                <tr>
                  <td colSpan={7} className="font-montserrat text-[13px] text-white/20 py-10 text-center">
                    No tickets yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    pending: { bg: "rgba(250,204,21,0.06)", text: "rgba(250,204,21,0.7)", border: "rgba(250,204,21,0.1)" },
    paid: { bg: "rgba(74,222,128,0.06)", text: "rgba(74,222,128,0.7)", border: "rgba(74,222,128,0.1)" },
    cancelled: { bg: "rgba(248,113,113,0.06)", text: "rgba(248,113,113,0.7)", border: "rgba(248,113,113,0.1)" },
  };
  const c = colors[status] || { bg: "rgba(255,255,255,0.03)", text: "rgba(255,255,255,0.3)", border: "rgba(255,255,255,0.05)" };

  return (
    <span
      className="inline-block px-2.5 py-1 rounded-lg font-montserrat text-[10px] font-medium uppercase tracking-wider"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {status}
    </span>
  );
}
