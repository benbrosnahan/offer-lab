import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "./globals.css";

// Two faces, shared with Loan Desk and Decode so the Cense tools read as one
// family. Bricolage carries headlines and headline figures. Instrument Sans
// carries everything that gets read or compared.
const display = Bricolage_Grotesque({
  variable: "--font-cense-display",
  subsets: ["latin"],
  display: "swap",
});

const body = Instrument_Sans({
  variable: "--font-cense-body",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://offer-lab-ivory.vercel.app";
const DESCRIPTION =
  "Type a salary and a city. See take-home pay after 2026 federal, state and city taxes, a typical rent and everyday costs, and what is left each month. Compare two offers.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Offer Lab by Cense: is your job offer enough to live on?",
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Offer Lab by Cense",
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Cense",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Offer Lab by Cense",
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFCEC",
  width: "device-width",
  initialScale: 1,
};

// Runs before first paint: when there is an offer to restore (a share link or
// this tab's saved state), hide the blank form until the app swaps it out, so
// the form never flashes. The app clears the flag once it has decided.
const RESTORE_FLAG = `try{if(/[?&]q=/.test(location.search)||sessionStorage.getItem("offer-lab-state"))document.documentElement.setAttribute("data-restoring","")}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: RESTORE_FLAG }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
