import type { NextConfig } from "next";

const storybookDevOrigin = "http://127.0.0.1:6006";

const nextConfig: NextConfig = {
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

export default nextConfig;
