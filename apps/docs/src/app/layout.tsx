import { RootProvider } from "fumadocs-ui/provider/next";
import { GeistMono, GeistSans } from "@godui/components/fonts/next";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoDUI",
  description: "A design system and component library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
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
