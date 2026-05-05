"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Inquiry {
  id: string;
  name: string;
  business_name: string;
  email: string;
  phone: string | null;
  website: string | null;
  message: string;
  status: string;
  created_at: string;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    reviewed: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    contacted: "bg-green-500/10 text-green-400 border-green-500/20",
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border ${styles[status] || styles.new}`}
    >
      {status}
    </span>
  );
}

export default function AdminPartnershipsPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetch("/api/admin/partnerships")
      .then((r) => r.json())
      .then((data) => setInquiries(data.inquiries || []))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingStatus(true);
    const res = await fetch("/api/admin/partnerships", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    if (res.ok) {
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status } : inq))
      );
      if (selected?.id === id) {
        setSelected((s) => (s ? { ...s, status } : s));
      }
    }
    setUpdatingStatus(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-bk-gold/20 border-t-bk-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-montserrat font-medium text-white text-[18px] tracking-[0.2em] uppercase">
            Partnership Inquiries
          </h1>
          <p className="font-montserrat text-white/30 text-[12px] mt-1">
            {inquiries.length} {inquiries.length === 1 ? "inquiry" : "inquiries"}
          </p>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-montserrat text-white/30 text-[14px]">
            No inquiries yet.
          </p>
        </div>
      ) : (
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="text-left px-5 py-3 font-montserrat font-medium text-[10px] text-white/30 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-5 py-3 font-montserrat font-medium text-[10px] text-white/30 uppercase tracking-wider">
                  Business
                </th>
                <th className="text-left px-5 py-3 font-montserrat font-medium text-[10px] text-white/30 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-5 py-3 font-montserrat font-medium text-[10px] text-white/30 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-5 py-3 font-montserrat font-medium text-[10px] text-white/30 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <tr
                  key={inq.id}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] cursor-pointer transition-colors"
                  onClick={() => setSelected(inq)}
                >
                  <td className="px-5 py-3.5 font-montserrat text-[13px] text-white/70">
                    {inq.name}
                  </td>
                  <td className="px-5 py-3.5 font-montserrat text-[13px] text-white/70">
                    {inq.business_name}
                  </td>
                  <td className="px-5 py-3.5 font-montserrat text-[12px] text-white/50">
                    {inq.email}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={inq.status} />
                  </td>
                  <td className="px-5 py-3.5 font-montserrat text-[12px] text-white/40">
                    {new Date(inq.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.5)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            />
            <motion.div
              className="fixed top-0 right-0 h-full w-full max-w-md z-50 overflow-y-auto"
              style={{
                background: "linear-gradient(135deg, #0d1117 0%, #080c12 100%)",
                borderLeft: "1px solid rgba(255,255,255,0.06)",
              }}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-montserrat font-medium text-white text-[14px] tracking-[0.15em] uppercase">
                    Inquiry Detail
                  </h2>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-white/30 hover:text-white/60 transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-5">
                  <Field label="Name" value={selected.name} />
                  <Field label="Business Name" value={selected.business_name} />
                  <Field label="Email" value={selected.email} />
                  {selected.phone && <Field label="Phone" value={selected.phone} />}
                  {selected.website && <Field label="Website / Social" value={selected.website} />}
                  <Field label="Message" value={selected.message} multiline />
                  <Field
                    label="Submitted"
                    value={new Date(selected.created_at).toLocaleString()}
                  />

                  <div className="pt-4 border-t border-white/[0.06]">
                    <p className="font-montserrat text-[10px] text-white/30 uppercase tracking-wider mb-2">
                      Status
                    </p>
                    <select
                      value={selected.status}
                      onChange={(e) => updateStatus(selected.id, e.target.value)}
                      disabled={updatingStatus}
                      className="w-full px-4 py-2.5 rounded-lg font-montserrat text-[13px] text-white/80 outline-none cursor-pointer"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="contacted">Contacted</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div>
      <p className="font-montserrat text-[10px] text-white/30 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className={`font-montserrat text-[13px] text-white/70 ${multiline ? "whitespace-pre-wrap" : ""}`}>
        {value}
      </p>
    </div>
  );
}
