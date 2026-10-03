import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const storybookDevOrigin = "http://127.0.0.1:6006";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  transpilePackages: ["@godui/components", "@godui/lab"],
  async redirects() {
    const superseded = [
      "layout/accordion",
      "navigation/combobox",
      "navigation/context-menu",
      "navigation/dropdown-menu",
      "overlays/command-palette",
      "overlays/drawer",
      "overlays/toast",
    ];
    return [
      // Superseded by core shadcn drop-ins; temporary until wave 1 ships them.
      ...superseded.flatMap((p) => [
        {
          source: `/docs/components/${p}`,
          destination: "/docs/components",
          permanent: false,
        },
        {
          source: `/docs/components/${p}/learn`,
          destination: "/docs/components",
          permanent: false,
        },
      ]),
      // Pre-pivot component docs moved to /docs/extras.
      {
        source:
          "/docs/components/:category(ai|backgrounds|buttons|collaboration|effects|glass|inputs|layout|navigation|overlays|text|visualizations)/:path*",
        destination: "/docs/extras/:category/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    // Pre-split install URLs (README, @godui/mcp@0.1.0) keep working. These run
    // after public/ files, so core items and index.json are served directly;
    // anything else falls through to the extras registry (static file or the
    // dynamic background route). `:item` is one segment, so /r/extras/* is
    // never rewritten.
    const registryCompat = [
      { source: "/r/:item", destination: "/r/extras/:item" },
    ];
    if (process.env.NODE_ENV === "development") {
      return [
        ...registryCompat,
        {
          source: "/design-system",
          destination: `${storybookDevOrigin}/design-system/`,
        },
        {
          source: "/design-system/",
          destination: `${storybookDevOrigin}/design-system/`,
        },
        {
          source: "/design-system/:path*",
          destination: `${storybookDevOrigin}/design-system/:path*`,
        },
      ];
    }
    return registryCompat;
  },
};

export default withMDX(nextConfig);
