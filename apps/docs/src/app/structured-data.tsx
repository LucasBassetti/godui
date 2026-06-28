const SITE_URL = "https://godui.design";

/**
 * Site-wide JSON-LD (schema.org) injected into every page's <head>.
 *
 * aeo.js only writes a standalone /schema.json file at build time — it does
 * NOT embed structured data in the rendered HTML, which is what crawlers and
 * answer engines actually read. So we emit it in-page here.
 */
export function SiteStructuredData() {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "GodUI",
        url: SITE_URL,
        description:
          "An open-source collection of beautifully crafted motion components built with React, TypeScript, Tailwind CSS, Motion, and shadcn/ui.",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "GodUI",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/icon.svg`,
        },
        sameAs: ["https://github.com/LucasBassetti/godui"],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#software`,
        name: "GodUI",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        url: SITE_URL,
        description:
          "An open-source collection of beautifully crafted motion components built with React, TypeScript, Tailwind CSS, Motion, and shadcn/ui.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires raw script injection.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
