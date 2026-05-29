import type { Metadata } from "next";
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
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/icon.svg",
  },
  openGraph: {
    siteName: "FFellonics",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
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
