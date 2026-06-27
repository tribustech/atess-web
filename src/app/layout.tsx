import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { PageTransition } from "@/components/motion/PageTransition";
import { IntroLoader } from "@/components/motion/IntroLoader";
import "./globals.css";

// Runs before first paint on a hard load: flags the homepage's first visit so a
// dark cover paints immediately (no page flash before the intro animation mounts).
const introBootstrap = `try{var p=location.pathname;if((p==='/'||p==='')&&!sessionStorage.getItem('atess_intro_seen')){document.documentElement.classList.add('intro-active')}}catch(e){}`;

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
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ATESS Project — Pardoseli profesionale",
    template: "%s | ATESS Project",
  },
  description:
    "Pardoseli profesionale pentru exterior și interior. Aplicator certificat Stockmeier. 10+ ani pe teren.",
  applicationName: "ATESS Project",
  keywords: [
    "pardoseli profesionale",
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
    title: "ATESS Project — Pardoseli profesionale",
    description: "Pardoseli profesionale pentru exterior și interior. Aplicator certificat Stockmeier.",
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
    title: "ATESS Project — Pardoseli profesionale",
    description: "Pardoseli profesionale pentru exterior și interior. Aplicator certificat Stockmeier.",
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
        <script dangerouslySetInnerHTML={{ __html: introBootstrap }} />
        <div id="intro-cover" aria-hidden="true" />
        <LenisProvider>
          <IntroLoader />
          <Header />
          <PageTransition>{children}</PageTransition>
          <Footer />
        </LenisProvider>
        <Analytics />
      </body>
    </html>
  );
}
