import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, Space_Grotesk } from "next/font/google";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500"],
  style: ["italic"],
  variable: "--font-fraunces",
  display: "swap",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://atess.ro";

export const viewport: Viewport = {
  themeColor: "#0B0B0D",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ATESS Project — Pardoseli sportive profesionale",
    template: "%s | ATESS Project",
  },
  description:
    "Pardoseli sportive profesionale. Aplicator certificat Stockmeier. 10+ ani pe teren.",
  applicationName: "ATESS Project",
  keywords: [
    "pardoseli sportive",
    "Stockmeier",
    "tartan",
    "piste atletism",
    "multisport",
    "România",
  ],
  authors: [{ name: "ATESS Project" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    url: "/",
    siteName: "ATESS Project",
    title: "ATESS Project — Pardoseli sportive profesionale",
    description: "Aplicator certificat Stockmeier.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "ATESS Project",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ATESS Project",
    description: "Pardoseli sportive profesionale",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ro"
      className={`dark ${inter.variable} ${fraunces.variable} ${spaceGrotesk.variable}`}
    >
      <body className="bg-bg-base text-text-primary min-h-screen flex flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
