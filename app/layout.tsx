import type { Metadata } from "next";
import {
  Dancing_Script,
  Bebas_Neue,
  Cormorant_Garamond,
  Montserrat,
} from "next/font/google";
import "./globals.css";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-dancing-script",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas-neue",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant-garamond",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Billy Knight — Official Theatrical Experience",
  description:
    "A film by Alec Griffen Roth. Starring Al Pacino, Charlie Heaton, Diana Silvers. In select theaters August 21, 2026.",
  openGraph: {
    title: "Billy Knight — Official Theatrical Experience",
    description:
      "A film by Alec Griffen Roth. In select theaters August 21, 2026.",
    url: "https://billyknightmovie.com",
    siteName: "Billy Knight",
    images: [
      {
        url: "https://billyknightmovie.com/images/poster-BK.jpg",
        width: 900,
        height: 1200,
        alt: "Billy Knight — Official Theatrical Experience",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Billy Knight — Official Theatrical Experience",
    description:
      "A film by Alec Griffen Roth. Starring Al Pacino, Charlie Heaton, Diana Silvers.",
    images: ["https://billyknightmovie.com/images/poster-BK.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body
        className={`${dancingScript.variable} ${bebasNeue.variable} ${cormorantGaramond.variable} ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
