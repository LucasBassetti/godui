import { GeistMono, GeistSans } from "@godui/components/fonts/next";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GodUI",
  description: "A design system and component library",
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
      </body>
    </html>
  );
}
