import { GeistMono, GeistSans } from "@godui/components/fonts/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import "./globals.css";
import { GodSearchDialog } from "@/components/search-dialog";
import { AeoWidget } from "./aeo-widget";
import { SiteStructuredData } from "./structured-data";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const SITE_TITLE = "GodUI — UI Collection for Modern Interfaces";
const SITE_DESCRIPTION =
  "An open-source collection of beautifully crafted motion components built with React, TypeScript, Tailwind CSS, Motion, and shadcn/ui.";

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
        alt: "GodUI — UI Collection for Modern Interfaces",
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
          search={{ SearchDialog: GodSearchDialog }}
        >
          {children}
        </RootProvider>
        <AeoWidget />
      </body>
      {GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
    </html>
  );
}
