"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueData {
  totalRevenue: number;
  avgOrderValue: number;
  totalTickets: number;
  totalOrders: number;
  byScreening: { name: string; revenue: number }[];
  byCreator: { name: string; revenue: number }[];
  overTime: { date: string; revenue: number }[];
}

export default function RevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [statsRes, ticketsRes, creatorsRes, screeningsRes] =
        await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/tickets?page=1"),
          fetch("/api/admin/creators"),
          fetch("/api/admin/screenings"),
        ]);

      const stats = await statsRes.json();
      const ticketsData = await ticketsRes.json();
      const creatorsData = await creatorsRes.json();
      const screeningsData = await screeningsRes.json();

      const allTicketsRes = await fetch(
        `/api/admin/tickets?page=1&status=paid`
      );
      const allPaid = await allTicketsRes.json();
      const paidTickets = allPaid.tickets || [];

      const totalRevenue = paidTickets.reduce(
        (s: number, t: { price_total: number }) => s + Number(t.price_total || 0),
        0
      );
      const totalTickets = paidTickets.reduce(
        (s: number, t: { quantity: number }) => s + (t.quantity || 0),
        0
      );
      const totalOrders = paidTickets.length;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      const screeningMap: Record<string, string> = {};
      (screeningsData.screenings || []).forEach(
        (s: { id: string; venue_name: string }) => {
          screeningMap[s.id] = s.venue_name;
        }
      );

      const revByScreening: Record<string, number> = {};
      paidTickets.forEach(
        (t: { screening_id: string; price_total: number }) => {
          const name = screeningMap[t.screening_id] || "Unknown";
          revByScreening[name] =
            (revByScreening[name] || 0) + Number(t.price_total || 0);
        }
      );

      const revByCreator: Record<string, number> = {};
      paidTickets
        .filter((t: { referral_code: string | null }) => t.referral_code)
        .forEach((t: { referral_code: string; price_total: number }) => {
          revByCreator[t.referral_code] =
            (revByCreator[t.referral_code] || 0) + Number(t.price_total || 0);
        });

      const revOverTime: Record<string, number> = {};
      paidTickets.forEach(
        (t: { created_at: string; price_total: number }) => {
          const day = t.created_at?.split("T")[0];
          if (day) revOverTime[day] = (revOverTime[day] || 0) + Number(t.price_total || 0);
        }
      );

      const creatorNames: Record<string, string> = {};
      (creatorsData.creators || []).forEach(
        (c: { slug: string; name: string }) => {
          creatorNames[c.slug] = c.name;
        }
      );

      setData({
        totalRevenue,
        avgOrderValue,
        totalTickets,
        totalOrders,
        byScreening: Object.entries(revByScreening)
          .map(([name, revenue]) => ({ name, revenue }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 15),
        byCreator: Object.entries(revByCreator)
          .map(([slug, revenue]) => ({
            name: creatorNames[slug] || slug,
            revenue,
          }))
          .sort((a, b) => b.revenue - a.revenue),
        overTime: Object.entries(revOverTime)
          .map(([date, revenue]) => ({ date, revenue }))
          .sort((a, b) => a.date.localeCompare(b.date)),
      });

      void stats;
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-transparent border-t-bk-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const statCards = [
    {
      label: "Total Revenue",
      value: `$${data.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    },
    {
      label: "Avg Order Value",
      value: `$${data.avgOrderValue.toFixed(2)}`,
    },
    {
      label: "Total Tickets (Paid)",
      value: data.totalTickets.toLocaleString(),
    },
    {
      label: "Total Orders",
      value: data.totalOrders.toLocaleString(),
    },
  ];

  const cardStyle = {
    background: "rgba(255,255,255,0.025)" as const,
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "16px",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 2px 12px rgba(0,0,0,0.15)",
  };

  const tooltipStyle = {
    background: "rgba(8,12,18,0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 10,
    fontSize: 12,
    fontFamily: "var(--font-montserrat)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  };

  return (
    <div>
      <h1 className="font-montserrat font-medium text-white text-[13px] tracking-[0.2em] uppercase mb-6">
        Revenue
      </h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="p-5" style={cardStyle}>
            <p className="font-montserrat font-semibold text-[28px] text-white leading-none">
              {card.value}
            </p>
            <p className="font-montserrat font-medium text-[11px] text-white/25 mt-2">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {data.overTime.length > 0 && (
        <div className="p-5 mb-6" style={cardStyle}>
          <h2 className="font-montserrat font-medium text-white/40 text-[10px] tracking-[0.2em] uppercase mb-4">
            Revenue Over Time
          </h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.overTime}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }}
                tickFormatter={(v) =>
                  new Date(v + "T00:00").toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{ color: "rgba(255,255,255,0.3)" }}
                formatter={(value) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#f0c93a"
                strokeWidth={2}
                dot={{ r: 3, fill: "#f0c93a" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {data.byScreening.length > 0 && (
          <div className="p-5" style={cardStyle}>
            <h2 className="font-montserrat font-medium text-white/40 text-[10px] tracking-[0.2em] uppercase mb-4">
              Revenue by Venue
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data.byScreening}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }}
                  tickFormatter={(v) => `$${v}`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 9 }}
                  width={140}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="rgba(255,255,255,0.5)" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {data.byCreator.length > 0 && (
          <div className="p-5" style={cardStyle}>
            <h2 className="font-montserrat font-medium text-white/40 text-[10px] tracking-[0.2em] uppercase mb-4">
              Revenue by Creator
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.byCreator}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.04)"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 11 }}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="rgba(255,255,255,0.5)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {data.byScreening.length === 0 &&
        data.byCreator.length === 0 &&
        data.overTime.length === 0 && (
          <p className="font-montserrat text-[14px] text-white/25 text-center py-16">
            No paid ticket data yet
          </p>
        )}
    </div>
  );
}
