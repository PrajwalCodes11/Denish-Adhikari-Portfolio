import type { Metadata } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://denish-adhikari-portfolio.vercel.app");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Er. Denish Adhikari | Civil Site Engineer & Surveyor (Nepal)",
  description:
    "Official portfolio of Er. Denish Adhikari, Registered Civil Engineer (Nepal Engineering Council). Specialized in wastewater treatment plant construction, RCC tanks, Total Station & Auto Level surveying, and quality control.",
  keywords: [
    "Civil Engineer Nepal",
    "Er. Denish Adhikari",
    "Site Engineer Kathmandu",
    "Surveyor Nepal",
    "Total Station Survey",
    "Auto Level",
    "RCC Tank Construction",
    "Sarathi Construction",
    "Construction of Wastewater Treatment Plant at Sallaghari, Kodku and Dhobighat",
    "Nepal Engineering Council",
    "ETABS Seismic Design",
  ],
  authors: [{ name: "Er. Denish Adhikari" }],
  creator: "Er. Denish Adhikari",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
  openGraph: {
    title: "Er. Denish Adhikari | Civil Site Engineer & Surveyor (Nepal)",
    description:
      "NEC Registered Civil Engineer with field experience supervising heavy RCC wastewater treatment infrastructure, Total Station surveying, and structural quality control.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Er. Denish Adhikari - Civil Site Engineer & Surveyor (Nepal)",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Er. Denish Adhikari | Civil Site Engineer & Surveyor (Nepal)",
    description:
      "Civil Engineer specialized in wastewater infrastructure, reinforced concrete execution, precision surveying, and structural QA/QC.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0B0F14] text-text-primary antialiased selection:bg-accent selection:text-white">
        {children}
      </body>
    </html>
  );
}
