import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Offer Lab by Cense — Is your job offer enough to live on?",
  description:
    "Find out what your job offer actually means. See take-home pay, real cost of living, and whether you can afford the city — based on 2025 tax brackets and current rent data.",
  openGraph: {
    title: "Offer Lab — What your job offer actually means",
    description:
      "Compare salary, cost of living, and take-home pay across cities. Real numbers, no signup.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Offer Lab — What your job offer actually means",
    description:
      "Compare salary, cost of living, and take-home pay across cities. Real numbers, no signup.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full">
        <noscript>
          <p style={{ padding: "1rem", textAlign: "center" }}>
            Offer Lab requires JavaScript to run the calculations locally in
            your browser.
          </p>
        </noscript>
        {children}
      </body>
    </html>
  );
}
