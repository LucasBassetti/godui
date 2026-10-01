import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const appDir = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../.next/server/app",
);

const SITE_URL = "https://godui.design";
const SITE_TITLE = "GodUI — UI Collection for Modern Interfaces";
const SITE_DESCRIPTION =
  "An open-source collection of beautifully crafted motion components built with React, TypeScript, Tailwind CSS, Motion, and shadcn/ui.";

const pages = [
  {
    file: "docs/installation.html",
    path: "/docs/installation",
    title: "Installation",
    description: "Install GodUI components with the shadcn CLI.",
  },
  {
    file: "docs/extras/layout/tilt-card.html",
    path: "/docs/extras/layout/tilt-card",
    title: "Tilt Card",
    description:
      "A card that tilts in 3D toward the pointer with parallax depth and a specular glare.",
  },
  {
    file: "docs/extras/layout/tilt-card/learn.html",
    path: "/docs/extras/layout/tilt-card/learn",
    title: "Anatomy of Tilt Card",
    description:
      "How one spring-smoothed pointer value drives a card's rotation, its floating content, and a glare that chases the cursor.",
  },
  {
    file: "index.html",
    path: "/",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
];

function readTagAttributes(html, tagName, attributeName, attributeValue) {
  const tags = html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "g"));

  for (const match of tags) {
    const attributes = Object.fromEntries(
      [...match[0].matchAll(/([:\w-]+)="([^"]*)"/g)].map(([, key, value]) => [
        key,
        value,
      ]),
    );

    if (attributes[attributeName] === attributeValue) return attributes;
  }

  assert.fail(
    `Could not find <${tagName} ${attributeName}="${attributeValue}">`,
  );
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function readMetadata(html) {
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  assert.ok(title, "Could not find the document title");

  const description = readTagAttributes(html, "meta", "name", "description");
  const openGraphTitle = readTagAttributes(
    html,
    "meta",
    "property",
    "og:title",
  );
  const openGraphDescription = readTagAttributes(
    html,
    "meta",
    "property",
    "og:description",
  );
  const openGraphUrl = readTagAttributes(html, "meta", "property", "og:url");
  const canonical = readTagAttributes(html, "link", "rel", "canonical");

  return {
    title: decodeHtmlEntities(title),
    description: decodeHtmlEntities(description.content),
    openGraphTitle: decodeHtmlEntities(openGraphTitle.content),
    openGraphDescription: decodeHtmlEntities(openGraphDescription.content),
    openGraphUrl: decodeHtmlEntities(openGraphUrl.content),
    canonical: decodeHtmlEntities(canonical.href),
  };
}

for (const page of pages) {
  test(`emits correct metadata for ${page.path}`, async () => {
    const html = await readFile(resolve(appDir, page.file), "utf8");
    const metadata = readMetadata(html);
    const expectedCanonical =
      page.path === "/" ? SITE_URL : `${SITE_URL}${page.path}`;
    const expectedTitle =
      page.path === "/" ? page.title : `${page.title} — GodUI`;

    assert.deepEqual(metadata, {
      title: expectedTitle,
      description: page.description,
      openGraphTitle: page.title,
      openGraphDescription: page.description,
      openGraphUrl: expectedCanonical,
      canonical: expectedCanonical,
    });
  });
}
