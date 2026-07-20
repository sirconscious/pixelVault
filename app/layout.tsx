import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const SITE_URL = "https://pixelvault-liart.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PixelVault — game credits, handed over by a human",
    template: "%s — PixelVault",
  },
  description:
    "Steam Wallet, Xbox Gift Cards, PC game keys. No account, no checkout form — send a message on WhatsApp and a real person replies with your codes.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "PixelVault",
    url: SITE_URL,
    title: "PixelVault — game credits, handed over by a human",
    description:
      "Steam Wallet, Xbox Gift Cards, PC game keys. No account, no checkout form — send a message on WhatsApp and a real person replies with your codes.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PixelVault — game credits, handed over by a human",
    description:
      "Steam Wallet, Xbox Gift Cards, PC game keys. No account, no checkout form — send a message on WhatsApp and a real person replies with your codes.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PixelVault",
    url: SITE_URL,
    description:
      "Steam Wallet, Xbox Gift Cards, PC game keys. No account, no checkout form — send a message on WhatsApp and a real person replies with your codes.",
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PixelVault",
    url: SITE_URL,
  };

  return (
    <html
      lang="en"
      data-theme="Borderly"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
      </head>
      <body className="bg-base-100 text-base-content font-body min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
