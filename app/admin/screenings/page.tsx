"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Screening {
  id: string;
  venue_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  date: string;
  time: string;
  capacity: number;
  tickets_sold: number;
  status: string;
  is_active: boolean;
  created_at: string;
}

export default function ScreeningsPage() {
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [venueSearch, setVenueSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [showModal, setShowModal] = useState(false);
  const [editingCapacity, setEditingCapacity] = useState<string | null>(null);
  const [editCapacityValue, setEditCapacityValue] = useState("");
  const [archiveConfirm, setArchiveConfirm] = useState<string | null>(null);

  const fetchScreenings = useCallback(async () => {
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (venueSearch) params.set("venue", venueSearch);
    params.set("sort_by", sortBy);
    const res = await fetch(`/api/admin/screenings?${params}`);
    const data = await res.json();
    setScreenings(data.screenings || []);
    setLoading(false);
  }, [statusFilter, venueSearch, sortBy]);

  useEffect(() => {
    fetchScreenings();
  }, [fetchScreenings]);

  const toggleStatus = async (id: string, current: string) => {
    const newStatus = current === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setScreenings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    await fetch("/api/admin/screenings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
  };

  const saveCapacity = async (id: string) => {
    const cap = parseInt(editCapacityValue);
    if (isNaN(cap) || cap < 1) return;
    setScreenings((prev) =>
      prev.map((s) => (s.id === id ? { ...s, capacity: cap } : s))
    );
    setEditingCapacity(null);
    await fetch("/api/admin/screenings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, capacity: cap }),
    });
  };

  const archiveScreening = async (id: string) => {
    setScreenings((prev) => prev.filter((s) => s.id !== id));
    setArchiveConfirm(null);
    await fetch("/api/admin/screenings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active: false }),
    });
  };

  const grouped = screenings.reduce(
    (acc, s) => {
      const key = s.venue_name;
      if (!acc[key]) acc[key] = [];
      acc[key].push(s);
      return acc;
    },
    {} as Record<string, Screening[]>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-transparent border-t-bk-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-montserrat font-medium text-white text-[13px] tracking-[0.2em] uppercase">
          Venues & Screenings
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 font-montserrat font-medium text-[12px] tracking-[0.06em] text-white/90 rounded-lg transition-all hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 3px rgba(0,0,0,0.12)",
          }}
        >
          + ADD SCREENING
        </button>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        {(["all", "PUBLISHED", "DRAFT"] as const).map((val) => (
          <button
            key={val}
            onClick={() => setStatusFilter(val)}
            className={`px-3.5 py-2 font-montserrat text-[12px] rounded-lg transition-all ${
              statusFilter === val
                ? "text-white"
                : "text-bk-dim hover:text-bk-white"
            }`}
            style={{
              background: statusFilter === val ? "rgba(255,255,255,0.08)" : "transparent",
              border: statusFilter === val ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {val === "all" ? "All" : val === "PUBLISHED" ? "Published" : "Draft"}
          </button>
        ))}
        <input
          type="text"
          placeholder="Search venue..."
          value={venueSearch}
          onChange={(e) => setVenueSearch(e.target.value)}
          className="px-3.5 py-2 font-montserrat text-[12px] rounded-xl outline-none w-48"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "var(--bk-white)",
          }}
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3.5 py-2 font-montserrat text-[12px] rounded-xl outline-none"
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "var(--bk-white)",
          }}
        >
          <option value="date">Sort by Date</option>
          <option value="venue">Sort by Venue</option>
          <option value="tickets_sold">Sort by Tickets Sold</option>
        </select>
      </div>

      {Object.entries(grouped).map(([venueName, venueScreenings]) => (
        <div key={venueName} className="mb-6">
          <h2 className="font-montserrat font-medium text-white/40 text-[10px] tracking-[0.2em] uppercase mb-2">
            {venueName}
            <span className="font-montserrat font-light text-[12px] text-white/25 ml-3">
              {venueScreenings[0].city}, {venueScreenings[0].state}
            </span>
          </h2>
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.05)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 2px 12px rgba(0,0,0,0.15)",
            }}
          >
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  {[
                    "Date",
                    "Time",
                    "Capacity",
                    "Sold / Remaining",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="font-montserrat font-medium text-[10px] text-white/30 tracking-wider py-3 px-4 uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {venueScreenings.map((s) => {
                  const pct = s.capacity
                    ? (s.tickets_sold / s.capacity) * 100
                    : 0;
                  return (
                    <tr
                      key={s.id}
                      className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="font-montserrat text-[13px] text-bk-white py-2.5 px-4">
                        {new Date(s.date + "T00:00").toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="font-montserrat text-[13px] text-bk-white py-2.5 px-4">
                        {formatTime(s.time)}
                      </td>
                      <td className="py-2.5 px-4">
                        {editingCapacity === s.id ? (
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              value={editCapacityValue}
                              onChange={(e) =>
                                setEditCapacityValue(e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveCapacity(s.id);
                                if (e.key === "Escape")
                                  setEditingCapacity(null);
                              }}
                              className="w-16 px-1 py-0.5 font-montserrat text-[12px] rounded-xl outline-none"
                              style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                color: "var(--bk-white)",
                              }}
                              autoFocus
                            />
                            <button
                              onClick={() => saveCapacity(s.id)}
                              className="text-green-400 text-[11px]"
                            >
                              ✓
                            </button>
                          </div>
                        ) : (
                          <span
                            className="font-montserrat text-[13px] text-bk-white cursor-pointer hover:text-bk-gold transition-colors"
                            onClick={() => {
                              setEditingCapacity(s.id);
                              setEditCapacityValue(String(s.capacity));
                            }}
                          >
                            {s.capacity}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-24 h-2 rounded-full overflow-hidden"
                            style={{ background: "rgba(255,255,255,0.06)" }}
                          >
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${Math.min(pct, 100)}%`,
                                background:
                                  pct >= 100 ? "#ef4444" : "rgba(255,255,255,0.5)",
                              }}
                            />
                          </div>
                          <span className="font-montserrat text-[11px] text-white/25 whitespace-nowrap">
                            {s.tickets_sold} / {s.capacity - s.tickets_sold}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <button
                          onClick={() => toggleStatus(s.id, s.status)}
                          className="flex items-center gap-2 group cursor-pointer"
                          title={`Click to ${s.status === "PUBLISHED" ? "unpublish" : "publish"}`}
                        >
                          <div
                            className="relative w-9 h-5 rounded-full transition-colors duration-200"
                            style={{
                              background: s.status === "PUBLISHED"
                                ? "rgba(34,197,94,0.3)"
                                : "rgba(122,143,168,0.2)",
                            }}
                          >
                            <div
                              className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
                              style={{
                                left: s.status === "PUBLISHED" ? "18px" : "2px",
                                background: s.status === "PUBLISHED" ? "#22c55e" : "#7a8fa8",
                              }}
                            />
                          </div>
                          <span className={`font-montserrat text-[10px] font-medium uppercase tracking-wider transition-colors ${
                            s.status === "PUBLISHED" ? "text-green-400" : "text-bk-dim"
                          } group-hover:text-bk-white`}>
                            {s.status}
                          </span>
                        </button>
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingCapacity(s.id);
                              setEditCapacityValue(String(s.capacity));
                            }}
                            className="font-montserrat text-[11px] text-bk-dim hover:text-bk-gold transition-colors"
                          >
                            Edit
                          </button>
                          {archiveConfirm === s.id ? (
                            <span className="flex items-center gap-1">
                              <button
                                onClick={() => archiveScreening(s.id)}
                                className="font-montserrat text-[11px] text-red-400"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setArchiveConfirm(null)}
                                className="font-montserrat text-[11px] text-bk-dim"
                              >
                                Cancel
                              </button>
                            </span>
                          ) : (
                            <button
                              onClick={() => setArchiveConfirm(s.id)}
                              className="font-montserrat text-[11px] text-bk-dim hover:text-red-400 transition-colors"
                            >
                              Archive
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {screenings.length === 0 && (
        <p className="font-montserrat text-[14px] text-white/25 text-center py-16">
          No screenings found
        </p>
      )}

      <AnimatePresence>
        {showModal && (
          <AddScreeningModal
            onClose={() => setShowModal(false)}
            onAdded={fetchScreenings}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddScreeningModal({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: () => void;
}) {
  const [form, setForm] = useState({
    venue_name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    date: "",
    time: "19:30",
    capacity: "200",
    status: "DRAFT",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const timePresets = ["13:30", "16:30", "19:30"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    let lat = 0,
      lng = 0;
    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          `${form.address}, ${form.city}, ${form.state} ${form.zip}`
        )}&countrycodes=us&format=json&limit=1`,
        { cache: "no-store" }
      );
      const geoData = await geoRes.json();
      if (geoData.length > 0) {
        lat = parseFloat(geoData[0].lat);
        lng = parseFloat(geoData[0].lon);
      }
    } catch {
      // geocoding failed, proceed with 0,0
    }

    const res = await fetch("/api/admin/screenings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        capacity: parseInt(form.capacity),
        lat,
        lng,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to add screening");
      setSaving(false);
      return;
    }

    onAdded();
    onClose();
  };

  const set = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(8,12,18,0.8)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
        style={{
          background: "rgba(11,21,37,0.75)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-montserrat font-medium text-white text-[13px] tracking-[0.15em] uppercase mb-4">
          Add Screening
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <ModalField
            label="Venue Name"
            value={form.venue_name}
            onChange={(v) => set("venue_name", v)}
            required
          />
          <ModalField
            label="Address"
            value={form.address}
            onChange={(v) => set("address", v)}
            required
          />
          <div className="grid grid-cols-3 gap-3">
            <ModalField
              label="City"
              value={form.city}
              onChange={(v) => set("city", v)}
              required
            />
            <ModalField
              label="State"
              value={form.state}
              onChange={(v) => set("state", v)}
              required
            />
            <ModalField
              label="Zip"
              value={form.zip}
              onChange={(v) => set("zip", v)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ModalField
              label="Date"
              type="date"
              value={form.date}
              onChange={(v) => set("date", v)}
              required
            />
            <div>
              <label className="block font-montserrat font-medium text-[10px] text-white/30 tracking-wider uppercase mb-1">
                Time
              </label>
              <div className="flex gap-1 mb-1">
                {timePresets.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set("time", t)}
                    className={`px-2 py-1 font-montserrat text-[10px] rounded-xl transition-colors ${
                      form.time === t
                        ? "text-white bg-white/10 border border-white/20"
                        : "text-bk-dim border border-white/[0.06] hover:border-white/20"
                    }`}
                  >
                    {formatTime(t)}
                  </button>
                ))}
              </div>
              <input
                type="time"
                value={form.time}
                onChange={(e) => set("time", e.target.value)}
                className="w-full px-3 py-2 font-montserrat text-[12px] rounded-xl outline-none"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "var(--bk-white)",
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ModalField
              label="Capacity"
              type="number"
              value={form.capacity}
              onChange={(v) => set("capacity", v)}
            />
            <div>
              <label className="block font-montserrat font-medium text-[10px] text-white/30 tracking-wider uppercase mb-1">
                Status
              </label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className="w-full px-3 py-2 font-montserrat text-[12px] rounded-xl outline-none"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "var(--bk-white)",
                }}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="font-montserrat text-[12px] text-red-400">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-montserrat text-[12px] text-bk-dim hover:text-bk-white transition-colors rounded-lg"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 font-montserrat font-medium text-[12px] tracking-[0.06em] text-white/90 rounded-lg transition-all disabled:opacity-50 hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 3px rgba(0,0,0,0.12)",
              }}
            >
              {saving ? "SAVING..." : "ADD SCREENING"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function ModalField({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block font-montserrat font-medium text-[10px] text-white/30 tracking-wider uppercase mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 font-montserrat text-[12px] rounded-xl outline-none"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          color: "var(--bk-white)",
        }}
      />
    </div>
  );
}

function formatTime(time: string) {
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
}
