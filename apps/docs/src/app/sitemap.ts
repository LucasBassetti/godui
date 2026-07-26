import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { source } from "@/lib/source";

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = source.getPages().map((page) => ({
    url: `${siteConfig.url}${page.url}`,
    lastModified: page.data.date ? new Date(page.data.date) : undefined,
  }));

  return [{ url: siteConfig.url, lastModified: new Date() }, ...docs];
}
