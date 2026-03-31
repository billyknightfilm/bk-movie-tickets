import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bk-black": "#080c12",
        "bk-navy": "#0b1525",
        "bk-blue": "#132240",
        "bk-glow": "#1a4a7a",
        "bk-gold": "#f0c93a",
        "bk-gold-dim": "#c9a830",
        "bk-white": "#f5f0e8",
        "bk-dim": "#7a8fa8",
      },
      fontFamily: {
        dancing: ["var(--font-dancing-script)", "cursive"],
        bebas: ["var(--font-bebas-neue)", "sans-serif"],
        cormorant: ["var(--font-cormorant-garamond)", "serif"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
