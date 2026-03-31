"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Creator {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  tickets_sold: number;
  individual_tickets: number;
  revenue: number;
}

interface Ticket {
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
}

export default function CreatorDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [creator, setCreator] = useState<Creator | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/creators?slug=${slug}`);
      const data = await res.json();
      setCreator(data.creator || null);
      setTickets(data.tickets || []);
      setLoading(false);
    }
    load();
  }, [slug]);

  const formatTime = (time: string) => {
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-transparent border-t-bk-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="text-center py-16">
        <p className="font-montserrat text-[14px] text-white/25">
          Creator not found
        </p>
        <Link
          href="/admin/creators"
          className="font-montserrat text-[13px] text-bk-gold mt-2 inline-block"
        >
          Back to Creators
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/creators"
        className="font-montserrat text-[12px] text-bk-dim hover:text-bk-gold transition-colors mb-4 inline-block"
      >
        &larr; Back to Creators
      </Link>

      <div className="flex items-center gap-4 mb-6">
        <h1 className="font-montserrat font-medium text-white text-[13px] tracking-[0.2em] uppercase">
          {creator.name}
        </h1>
        <span
          className={`px-2 py-0.5 rounded-lg font-montserrat text-[10px] font-medium uppercase tracking-wider ${
            creator.is_active
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {creator.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Slug", value: creator.slug },
          { label: "Email", value: creator.email || "—" },
          { label: "Phone", value: creator.phone || "—" },
          {
            label: "Tickets Sold",
            value: String(creator.individual_tickets),
          },
          {
            label: "Revenue",
            value: `$${Number(creator.revenue).toFixed(2)}`,
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl p-4"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.05)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 2px 12px rgba(0,0,0,0.15)",
            }}
          >
            <p className="font-montserrat font-medium text-[10px] text-white/30 tracking-wider uppercase mb-1">
              {card.label}
            </p>
            <p className="font-montserrat font-semibold text-[20px] text-white leading-none">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 2px 12px rgba(0,0,0,0.15)",
        }}
      >
        <div className="p-4 border-b border-white/5">
          <h2 className="font-montserrat font-medium text-white/40 text-[10px] tracking-[0.2em] uppercase">
            Ticket Purchases via {creator.name}
          </h2>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5">
              {["Buyer", "Screening", "Qty", "Total", "Status", "Date"].map(
                (h) => (
                  <th
                    key={h}
                    className="font-montserrat font-medium text-[10px] text-white/30 tracking-wider py-2.5 px-4 uppercase"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr
                key={t.id}
                className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
              >
                <td className="font-montserrat text-[13px] text-bk-white py-2.5 px-4">
                  {t.full_name}
                </td>
                <td className="font-montserrat text-[12px] text-bk-dim py-2.5 px-4">
                  {t.screening
                    ? `${t.screening.venue_name} — ${new Date(t.screening.date + "T00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })} ${formatTime(t.screening.time)}`
                    : "—"}
                </td>
                <td className="font-montserrat text-[13px] text-bk-white py-2.5 px-4">
                  {t.quantity}
                </td>
                <td className="font-montserrat text-[13px] text-bk-white py-2.5 px-4">
                  ${Number(t.price_total).toFixed(2)}
                </td>
                <td className="py-2.5 px-4">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-lg font-montserrat text-[10px] font-medium uppercase tracking-wider ${
                      t.status === "paid"
                        ? "bg-green-500/20 text-green-400"
                        : t.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="font-montserrat text-[11px] text-bk-dim py-2.5 px-4">
                  {new Date(t.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="font-montserrat text-[13px] text-white/25 py-8 text-center"
                >
                  No tickets through this creator yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
