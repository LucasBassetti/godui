import { GeistMono, GeistSans } from "@godui/components/fonts/next";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import "./globals.css";
import { AeoWidget } from "./aeo-widget";

export const metadata: Metadata = {
  title: "GodUI",
  description: "A design system and component library",
  metadataBase: new URL("https://godui.design"),
  alternates: {
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
