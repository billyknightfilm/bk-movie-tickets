"use client";

import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function WordmarkBlock() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center md:items-start gap-2"
    >
      <motion.h1
        variants={fadeUp}
        className="font-dancing font-bold text-bk-gold"
        style={{
          fontSize: "clamp(52px, 7vw, 80px)",
          textShadow: "0 2px 30px rgba(240,201,58,0.15)",
        }}
      >
        Billy Knight
      </motion.h1>
      <motion.p
        variants={fadeUp}
        className="font-cormorant italic font-light text-bk-dim text-[18px] md:text-[20px]"
      >
        An Alec Griffen Roth film
      </motion.p>
      <motion.p
        variants={fadeUp}
        className="font-montserrat font-light text-bk-dim text-[12px] md:text-[13px] tracking-[0.22em]"
      >
        Al Pacino &middot; Charlie Heaton &middot; Diana Silvers
      </motion.p>
    </motion.div>
  );
}
