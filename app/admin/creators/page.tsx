"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Creator {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  tickets_sold: number;
  individual_tickets: number;
  revenue: number;
}

export default function CreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCreator, setEditingCreator] = useState<Creator | null>(null);
  const [deletingCreator, setDeletingCreator] = useState<Creator | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchCreators = async () => {
    const res = await fetch("/api/admin/creators");
    const data = await res.json();
    setCreators(data.creators || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCreators();
  }, []);

  const toggleActive = async (id: string, currentActive: boolean) => {
    setCreators((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, is_active: !currentActive } : c
      )
    );
    await fetch("/api/admin/creators", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active: !currentActive }),
    });
  };

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`billyknightmovie.com/c/${slug}`);
    setCopied(slug);
    setTimeout(() => setCopied(null), 2000);
  };

  const rankStyle = (rank: number) => {
    if (rank === 1) return "text-[#f0c93a]";
    if (rank === 2) return "text-[#c0c0c0]";
    if (rank === 3) return "text-[#cd7f32]";
    return "text-bk-dim";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-transparent border-t-bk-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-montserrat font-medium text-white text-[13px] tracking-[0.2em] uppercase">
          Creators & Referrals
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
          + ADD CREATOR
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search creators by name or slug..."
          className="w-full max-w-sm px-3 py-2 font-montserrat text-[12px] rounded-xl outline-none"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "var(--bk-white)",
          }}
        />
      </div>

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
                "#",
                "Name",
                "Slug",
                "Email",
                "Phone",
                "Tickets Sold",
                "Revenue",
                "Short Link",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="font-montserrat font-medium text-[10px] text-white/30 tracking-wider py-2.5 px-4 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {creators
            .filter((c) => {
              if (!search.trim()) return true;
              const q = search.toLowerCase();
              return c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q) || (c.email && c.email.toLowerCase().includes(q));
            })
            .map((c, i) => {
              const rank = i + 1;
              return (
                <tr
                  key={c.id}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  <td
                    className={`font-montserrat font-bold text-[16px] py-2.5 px-4 ${rankStyle(rank)}`}
                  >
                    {rank}
                  </td>
                  <td className="py-2.5 px-4">
                    <Link
                      href={`/admin/creators/${c.slug}`}
                      className={`font-montserrat text-[13px] hover:text-bk-gold transition-colors ${
                        c.is_active
                          ? "text-bk-white"
                          : "text-bk-dim line-through"
                      }`}
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td className="font-montserrat text-[12px] text-bk-dim py-2.5 px-4">
                    {c.slug}
                  </td>
                  <td className="font-montserrat text-[11px] text-bk-dim py-2.5 px-4">
                    {c.email || "—"}
                  </td>
                  <td className="font-montserrat text-[11px] text-bk-dim py-2.5 px-4">
                    {c.phone || "—"}
                  </td>
                  <td className="font-montserrat text-[13px] text-bk-white py-2.5 px-4">
                    {c.individual_tickets}
                  </td>
                  <td className="font-montserrat text-[13px] text-bk-white py-2.5 px-4">
                    ${Number(c.revenue).toFixed(2)}
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="font-montserrat text-[11px] text-bk-dim">
                        /c/{c.slug}
                      </span>
                      <button
                        onClick={() => copyLink(c.slug)}
                        className="text-bk-dim hover:text-bk-gold transition-colors"
                        title="Copy link"
                      >
                        {copied === c.slug ? (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="2"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <rect
                              x="9"
                              y="9"
                              width="13"
                              height="13"
                              rx="2"
                              ry="2"
                            />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-2.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-lg font-montserrat text-[10px] font-medium uppercase tracking-wider ${
                        c.is_active
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {c.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/creators/${c.slug}`}
                        className="font-montserrat text-[11px] text-bk-dim hover:text-bk-gold transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => setEditingCreator(c)}
                        className="font-montserrat text-[11px] text-bk-dim hover:text-bk-gold transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleActive(c.id, c.is_active)}
                        className={`font-montserrat text-[11px] transition-colors ${
                          c.is_active
                            ? "text-bk-dim hover:text-red-400"
                            : "text-bk-dim hover:text-green-400"
                        }`}
                      >
                        {c.is_active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => setDeletingCreator(c)}
                        className="font-montserrat text-[11px] text-bk-dim hover:text-red-400 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {creators.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="font-montserrat text-[13px] text-white/25 py-8 text-center"
                >
                  No creators yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <AddCreatorModal
            onClose={() => setShowModal(false)}
            onAdded={fetchCreators}
          />
        )}
        {editingCreator && (
          <EditCreatorModal
            creator={editingCreator}
            onClose={() => setEditingCreator(null)}
            onSaved={fetchCreators}
          />
        )}
        {deletingCreator && (
          <DeleteCreatorModal
            creator={deletingCreator}
            onClose={() => setDeletingCreator(null)}
            onDeleted={fetchCreators}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddCreatorModal({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: () => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  const autoSlug = (n: string) =>
    n
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

  const handleNameChange = (v: string) => {
    setName(v);
    if (!slugEdited) setSlug(autoSlug(v));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch("/api/admin/creators", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, email: email || undefined, phone: phone || undefined }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to add creator");
      setSaving(false);
      return;
    }

    onAdded();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(8,12,18,0.8)" }}
      onClick={onClose}
    >
      <motion.form
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl p-6"
        style={{
          background: "rgba(255,255,255,0.025)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 2px 12px rgba(0,0,0,0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-montserrat font-medium text-white text-[13px] tracking-[0.15em] uppercase mb-4">
          Add Creator
        </h2>

        <div className="flex flex-col gap-3">
          <div>
            <label className="block font-montserrat font-medium text-[10px] text-white/30 tracking-wider uppercase mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              className="w-full px-3 py-2 font-montserrat text-[12px] rounded-xl outline-none"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "var(--bk-white)",
              }}
            />
          </div>
          <div>
            <label className="block font-montserrat font-medium text-[10px] text-white/30 tracking-wider uppercase mb-1">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugEdited(true);
              }}
              required
              className="w-full px-3 py-2 font-montserrat text-[12px] rounded-xl outline-none"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "var(--bk-white)",
              }}
            />
            <p className="font-montserrat text-[10px] text-white/25 mt-1">
              billyknightmovie.com/c/{slug || "..."}
            </p>
          </div>
          <div>
            <label className="block font-montserrat font-medium text-[10px] text-white/30 tracking-wider uppercase mb-1">
              Email (optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 font-montserrat text-[12px] rounded-xl outline-none"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "var(--bk-white)",
              }}
            />
          </div>
          <div>
            <label className="block font-montserrat font-medium text-[10px] text-white/30 tracking-wider uppercase mb-1">
              Phone (optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 font-montserrat text-[12px] rounded-xl outline-none"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "var(--bk-white)",
              }}
            />
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
              className="px-4 py-2 font-montserrat text-[12px] text-bk-dim hover:text-bk-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 font-montserrat font-medium text-[12px] tracking-[0.06em] text-white/90 rounded-lg transition-opacity disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 3px rgba(0,0,0,0.12)",
              }}
            >
              {saving ? "SAVING..." : "ADD CREATOR"}
            </button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
}

const modalOverlay = "fixed inset-0 z-[100] flex items-center justify-center";
const modalBg = { background: "rgba(8,12,18,0.8)" };
const modalPanel = {
  background: "rgba(255,255,255,0.025)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.03), 0 2px 12px rgba(0,0,0,0.15)",
};
const inputStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.06)",
  color: "var(--bk-white)",
};
const btnStyle = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), 0 1px 3px rgba(0,0,0,0.12)",
};

function EditCreatorModal({
  creator,
  onClose,
  onSaved,
}: {
  creator: Creator;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(creator.name);
  const [email, setEmail] = useState(creator.email || "");
  const [phone, setPhone] = useState(creator.phone || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setSaving(true);
    setError("");

    const res = await fetch("/api/admin/creators", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: creator.id,
        name: name.trim(),
        email: email.trim() || "",
        phone: phone.trim() || "",
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to update creator");
      setSaving(false);
      return;
    }

    onSaved();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={modalOverlay}
      style={modalBg}
      onClick={onClose}
    >
      <motion.form
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl p-6"
        style={modalPanel}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-montserrat font-medium text-white text-[13px] tracking-[0.15em] uppercase mb-4">
          Edit Creator
        </h2>

        <div className="flex flex-col gap-3">
          <div>
            <label className="block font-montserrat font-medium text-[10px] text-white/30 tracking-wider uppercase mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 font-montserrat text-[12px] rounded-xl outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block font-montserrat font-medium text-[10px] text-white/30 tracking-wider uppercase mb-1">
              Slug
            </label>
            <p className="font-montserrat text-[12px] text-bk-dim px-3 py-2">
              {creator.slug}
            </p>
          </div>
          <div>
            <label className="block font-montserrat font-medium text-[10px] text-white/30 tracking-wider uppercase mb-1">
              Email (optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 font-montserrat text-[12px] rounded-xl outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block font-montserrat font-medium text-[10px] text-white/30 tracking-wider uppercase mb-1">
              Phone (optional)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 font-montserrat text-[12px] rounded-xl outline-none"
              style={inputStyle}
            />
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
              className="px-4 py-2 font-montserrat text-[12px] text-bk-dim hover:text-bk-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 font-montserrat font-medium text-[12px] tracking-[0.06em] text-white/90 rounded-lg transition-opacity disabled:opacity-50"
              style={btnStyle}
            >
              {saving ? "SAVING..." : "SAVE CHANGES"}
            </button>
          </div>
        </div>
      </motion.form>
    </motion.div>
  );
}

function DeleteCreatorModal({
  creator,
  onClose,
  onDeleted,
}: {
  creator: Creator;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setDeleting(true);
    setError("");

    const res = await fetch("/api/admin/creators", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: creator.id }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to delete creator");
      setDeleting(false);
      return;
    }

    onDeleted();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={modalOverlay}
      style={modalBg}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-sm rounded-2xl p-6"
        style={modalPanel}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-montserrat font-medium text-white text-[13px] tracking-[0.15em] uppercase mb-3">
          Delete Creator
        </h2>
        <p className="font-montserrat text-[13px] text-white/50 mb-1">
          Are you sure you want to delete <span className="text-bk-white font-medium">{creator.name}</span>?
        </p>
        <p className="font-montserrat text-[11px] text-white/25 mb-5">
          This cannot be undone. Existing tickets with this referral code will remain.
        </p>

        {error && (
          <p className="font-montserrat text-[12px] text-red-400 mb-3">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 font-montserrat text-[12px] text-bk-dim hover:text-bk-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-5 py-2 font-montserrat font-medium text-[12px] tracking-[0.06em] rounded-lg transition-opacity disabled:opacity-50"
            style={{
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#f87171",
            }}
          >
            {deleting ? "DELETING..." : "DELETE"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
