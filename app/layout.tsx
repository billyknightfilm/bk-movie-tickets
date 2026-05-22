import type { Metadata } from "next";
import Script from "next/script";
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
        <Script id="tiktok-pixel" strategy="afterInteractive">{`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
  ttq.load('D87RG33C77U6OC337NU0');
  ttq.page();
}(window, document, 'ttq');
`}</Script>
      </head>
      <body
        className={`${dancingScript.variable} ${bebasNeue.variable} ${cormorantGaramond.variable} ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
