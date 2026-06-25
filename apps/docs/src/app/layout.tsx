import { GeistMono, GeistSans } from "@godui/components/fonts/next";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import "./globals.css";
import { AeoWidget } from "./aeo-widget";
import { SiteStructuredData } from "./structured-data";

const SITE_TITLE = "GodUI — Animated React UI Components for Design Engineers";
const SITE_DESCRIPTION =
  "GodUI is an open-source collection of animated UI components for React, built with TypeScript, Tailwind CSS, and Motion. Copy-paste, shadcn/ui-ready components for design engineers.";

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: "%s — GodUI",
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL("https://godui.design"),
  alternates: {
    canonical: "/",
    types: {
      "text/plain": [
        { url: "/llms.txt", title: "LLM Summary" },
        { url: "/llms-full.txt", title: "Full Content for LLMs" },
      ],
      "application/json": [
        { url: "/ai-index.json", title: "AI-Optimized Index" },
      ],
    },
  },
  openGraph: {
    type: "website",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: "GodUI",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GodUI — UI collection for Design Engineers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className={GeistSans.className}>
        <SiteStructuredData />
        <RootProvider
          theme={{
            defaultTheme: "system",
            enableSystem: true,
            enabled: true,
          }}
        >
          {children}
        </RootProvider>
        <AeoWidget />
      </body>
    </html>
  );
}
