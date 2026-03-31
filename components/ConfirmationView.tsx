"use client";

import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

interface ConfirmationViewProps {
  confirmationNumber: string;
  fullName: string;
  venueName: string;
  venueCity: string;
  venueState: string;
  screeningDate: string;
  screeningTime: string;
  quantity: number;
  amountPaid: number;
}

export default function ConfirmationView({
  confirmationNumber,
  fullName,
  venueName,
  venueCity,
  venueState,
  screeningDate,
  screeningTime,
  quantity,
  amountPaid,
}: ConfirmationViewProps) {
  const firstName = fullName.split(" ")[0];

  const rows = [
    { label: "Screening", value: venueName },
    { label: "Location", value: `${venueCity}, ${venueState}` },
    { label: "Date", value: formatDate(screeningDate) },
    { label: "Time", value: formatTime(screeningTime) },
    { label: "Tickets", value: `${quantity} ticket${quantity !== 1 ? "s" : ""}` },
    { label: "Total Paid", value: formatMoney(amountPaid) },
  ];

  return (
    <div className="w-full max-w-md mx-auto flex flex-col justify-center px-6 py-12 md:py-16">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.48, ease: EASE }}
        className="mb-2"
      >
        <p
          className="font-montserrat font-medium text-[10px] tracking-[0.26em] uppercase mb-2.5"
          style={{ color: "rgba(212,175,55,0.65)" }}
        >
          Booking Confirmed
        </p>
        <h1 className="font-bebas text-[48px] sm:text-[52px] tracking-[0.04em] uppercase leading-none m-0"
          style={{ color: "#F0E6CC" }}
        >
          {firstName ? "You\u2019re In," : "You\u2019re In."}
        </h1>
        {firstName && (
          <h1
            className="font-bebas text-[48px] sm:text-[52px] tracking-[0.04em] uppercase leading-none m-0"
            style={{ color: "#D4AF37" }}
          >
            {firstName}.
          </h1>
        )}
      </motion.div>

      {/* Confirmation number */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.52, ease: EASE, delay: 0.14 }}
        className="my-7 py-5"
        style={{
          borderTop: "1px solid rgba(212,175,55,0.18)",
          borderBottom: "1px solid rgba(212,175,55,0.18)",
        }}
      >
        <p
          className="font-montserrat font-medium text-[9px] tracking-[0.26em] uppercase mb-2.5"
          style={{ color: "rgba(240,230,204,0.3)" }}
        >
          Confirmation Number
        </p>
        <p
          className="font-montserrat font-medium text-[28px] sm:text-[32px] tracking-[0.12em] leading-none"
          style={{ color: "#D4AF37", wordBreak: "break-all" }}
        >
          {confirmationNumber}
        </p>
        <p
          className="font-montserrat text-[11px] mt-2 tracking-[0.04em]"
          style={{ color: "rgba(240,230,204,0.3)" }}
        >
          Save this number for your records.
        </p>
      </motion.div>

      {/* Order details */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.44, ease: EASE, delay: 0.24 }}
        className="mb-7"
      >
        {rows.map((row, i) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: EASE, delay: 0.28 + i * 0.06 }}
            className="flex justify-between items-baseline py-[11px]"
            style={{
              borderBottom:
                i < rows.length - 1
                  ? "1px solid rgba(255,252,245,0.06)"
                  : "none",
            }}
          >
            <span
              className="font-montserrat font-medium text-[10px] tracking-[0.16em] uppercase flex-shrink-0 mr-4"
              style={{ color: "rgba(240,230,204,0.32)" }}
            >
              {row.label}
            </span>
            <span
              className="font-montserrat text-right tracking-[0.01em]"
              style={{
                fontWeight: row.label === "Total Paid" ? 600 : 400,
                fontSize: row.label === "Total Paid" ? "15px" : "14px",
                color:
                  row.label === "Total Paid"
                    ? "#F0E6CC"
                    : "rgba(240,230,204,0.75)",
              }}
            >
              {row.value}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Seat selection notice */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.44, ease: EASE, delay: 0.68 }}
        className="rounded-lg p-[18px_20px] mb-6"
        style={{
          background: "rgba(212,175,55,0.06)",
          border: "1px solid rgba(212,175,55,0.2)",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: "#D4AF37" }}
          />
          <span
            className="font-montserrat font-semibold text-[10px] tracking-[0.18em] uppercase"
            style={{ color: "rgba(212,175,55,0.8)" }}
          >
            Seat Selection
          </span>
        </div>
        <p
          className="font-montserrat text-[13px] leading-[1.65] m-0"
          style={{ color: "rgba(240,230,204,0.6)" }}
        >
          You will receive an email closer to the release date with your seat
          selection details and everything you need for the evening. Keep your
          confirmation number handy.
        </p>
      </motion.div>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.82 }}
        className="font-montserrat text-[11px] tracking-[0.06em] text-center leading-[1.7]"
        style={{ color: "rgba(240,230,204,0.25)" }}
      >
        Questions?{" "}
        <a
          href="mailto:team@billyknightfilm.com"
          style={{ color: "rgba(212,175,55,0.5)" }}
        >
          team@billyknightfilm.com
        </a>
      </motion.p>
    </div>
  );
}
