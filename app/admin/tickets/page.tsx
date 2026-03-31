"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Ticket {
  id: string;
  ticket_number: string;
  screening_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  quantity: number;
  price_per_ticket: number;
  price_total: number;
  status: string;
  referral_code: string | null;
  created_at: string;
  screening: {
    venue_name: string;
    date: string;
    time: string;
    city: string;
    state: string;
  } | null;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    const res = await fetch(`/api/admin/tickets?${params}`);
    const data = await res.json();
    setTickets(data.tickets || []);
    setTotal(data.total || 0);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const exportCsv = () => {
    const params = new URLSearchParams({ format: "csv" });
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    window.open(`/api/admin/tickets?${params}`, "_blank");
  };

  const formatTime = (time: string) => {
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    return `${hour % 12 || 12}:${m} ${ampm}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-montserrat font-medium text-white text-[13px] tracking-[0.2em] uppercase">
          Tickets
          <span className="font-montserrat font-light text-[14px] text-white/25 ml-3">
            {total.toLocaleString()} total
          </span>
        </h1>
        <button
          onClick={exportCsv}
          className="px-5 py-2.5 font-montserrat font-medium text-[12px] tracking-[0.06em] text-white/90 rounded-lg transition-all hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 3px rgba(0,0,0,0.12)",
          }}
        >
          EXPORT CSV
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search name, email, or ticket #..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3.5 py-2 font-montserrat text-[12px] rounded-xl outline-none flex-1 max-w-sm"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "var(--bk-white)",
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2 font-montserrat text-[12px] rounded-xl outline-none"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "var(--bk-white)",
          }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div
        className="rounded-xl overflow-hidden mb-4"
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 2px 12px rgba(0,0,0,0.15)",
        }}
      >
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-5 h-5 border-2 border-transparent border-t-bk-gold rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  {[
                    "Ticket #",
                    "Name",
                    "Email",
                    "Venue",
                    "Date",
                    "Qty",
                    "Total",
                    "Status",
                    "Referral",
                    "Purchased",
                  ].map((h) => (
                    <th
                      key={h}
                      className="font-montserrat font-medium text-[10px] text-white/30 tracking-wider py-2.5 px-3 uppercase whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <td className="font-montserrat text-[12px] text-bk-gold py-2.5 px-3">
                      {t.ticket_number}
                    </td>
                    <td className="font-montserrat text-[12px] text-bk-white py-2.5 px-3 whitespace-nowrap">
                      {t.full_name}
                    </td>
                    <td className="font-montserrat text-[11px] text-bk-dim py-2.5 px-3">
                      {t.email}
                    </td>
                    <td className="font-montserrat text-[11px] text-bk-dim py-2.5 px-3 whitespace-nowrap">
                      {t.screening?.venue_name || "—"}
                    </td>
                    <td className="font-montserrat text-[11px] text-bk-dim py-2.5 px-3 whitespace-nowrap">
                      {t.screening
                        ? `${new Date(t.screening.date + "T00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })} ${formatTime(t.screening.time)}`
                        : "—"}
                    </td>
                    <td className="font-montserrat text-[12px] text-bk-white py-2.5 px-3">
                      {t.quantity}
                    </td>
                    <td className="font-montserrat text-[12px] text-bk-white py-2.5 px-3">
                      ${Number(t.price_total).toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="font-montserrat text-[11px] text-bk-dim py-2.5 px-3">
                      {t.referral_code || "—"}
                    </td>
                    <td className="font-montserrat text-[11px] text-bk-dim py-2.5 px-3 whitespace-nowrap">
                      {new Date(t.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {tickets.length === 0 && (
                  <tr>
                    <td
                      colSpan={10}
                      className="font-montserrat text-[13px] text-white/25 py-8 text-center"
                    >
                      No tickets found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3.5 py-1.5 font-montserrat text-[12px] text-bk-dim hover:text-bk-white disabled:opacity-30 transition-all rounded-lg"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            Previous
          </button>
          <span className="font-montserrat text-[12px] text-bk-dim px-3">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3.5 py-1.5 font-montserrat text-[12px] text-bk-dim hover:text-bk-white disabled:opacity-30 transition-all rounded-lg"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            Next
          </button>
        </div>
      )}

      <AnimatePresence>
        {selectedTicket && (
          <TicketDrawer
            ticket={selectedTicket}
            onClose={() => setSelectedTicket(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TicketDrawer({
  ticket,
  onClose,
}: {
  ticket: Ticket;
  onClose: () => void;
}) {
  const formatTime = (time: string) => {
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[90]"
        style={{ background: "rgba(8,12,18,0.6)" }}
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 bottom-0 w-[420px] z-[100] overflow-y-auto p-6"
        style={{
          background: "rgba(11,21,37,0.85)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-montserrat font-medium text-white text-[13px] tracking-[0.15em] uppercase">
            Ticket Details
          </h2>
          <button
            onClick={onClose}
            className="text-bk-dim hover:text-bk-white transition-colors text-[20px]"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <DrawerField label="Ticket #" value={ticket.ticket_number} gold />
          <DrawerField label="Status">
            <StatusBadge status={ticket.status} />
          </DrawerField>
          <DrawerField label="Full Name" value={ticket.full_name} />
          <DrawerField label="Email" value={ticket.email} />
          <DrawerField label="Phone" value={ticket.phone || "Not provided"} />
          <DrawerField label="Quantity" value={String(ticket.quantity)} />
          <DrawerField
            label="Price Per Ticket"
            value={`$${Number(ticket.price_per_ticket).toFixed(2)}`}
          />
          <DrawerField
            label="Total"
            value={`$${Number(ticket.price_total).toFixed(2)}`}
            gold
          />

          <div
            className="my-1"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          />

          <DrawerField
            label="Venue"
            value={ticket.screening?.venue_name || "—"}
          />
          <DrawerField
            label="Location"
            value={
              ticket.screening
                ? `${ticket.screening.city}, ${ticket.screening.state}`
                : "—"
            }
          />
          <DrawerField
            label="Date"
            value={
              ticket.screening
                ? new Date(
                    ticket.screening.date + "T00:00"
                  ).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—"
            }
          />
          <DrawerField
            label="Time"
            value={
              ticket.screening ? formatTime(ticket.screening.time) : "—"
            }
          />

          <div
            className="my-1"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
          />

          <DrawerField
            label="Referral Code"
            value={ticket.referral_code || "None"}
          />
          <DrawerField
            label="Purchased"
            value={new Date(ticket.created_at).toLocaleString()}
          />
        </div>
      </motion.div>
    </>
  );
}

function DrawerField({
  label,
  value,
  gold,
  children,
}: {
  label: string;
  value?: string;
  gold?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-montserrat font-medium text-[10px] text-white/30 tracking-wider uppercase mb-0.5">
        {label}
      </p>
      {children || (
        <p
          className={`font-montserrat text-[14px] ${gold ? "text-bk-gold" : "text-bk-white"}`}
        >
          {value}
        </p>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    paid: "bg-green-500/10 text-green-400 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-lg font-montserrat text-[10px] font-medium uppercase tracking-wider border ${styles[status] || "bg-bk-dim/10 text-white/30 border-bk-dim/20"}`}
    >
      {status}
    </span>
  );
}
