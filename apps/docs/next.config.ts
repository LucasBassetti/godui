import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const withMDX = createMDX();

const storybookDevOrigin = "http://127.0.0.1:6006";

const nextConfig: NextConfig = {
  transpilePackages: ["@godui/components"],
  async rewrites() {
    if (process.env.NODE_ENV === "development") {
      return [
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
    return [];
  },
};

export default withMDX(nextConfig);
