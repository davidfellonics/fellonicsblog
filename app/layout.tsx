import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
  preload: false, // body-text font — not on critical path, avoid render-blocking preload
});

export const metadata: Metadata = {
  title: {
    template: "%s — FFellonics",
    default: "FFellonics — Exploring Geometry",
  },
  description:
    "FFellonics is a blog exploring geometry — topology, tessellation, polyhedra, non-Euclidean geometry, sacred geometry, and mathematical art.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ffellonics",
  },
  openGraph: {
    siteName: "Ffellonics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@ffellonicforms",
    creator: "@ffellonicforms",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0f2240",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <body className="font-sans antialiased bg-white text-[#111111]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
