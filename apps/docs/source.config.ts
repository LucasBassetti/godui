import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
} from "fumadocs-mdx/config";

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    // `date` is the component's creation date (YYYY-MM-DD). Optional so existing
    // pages keep validating; a recent date drives the "New" sidebar badge.
    // Reuses fumadocs' own zod string (via `.shape.title`) to avoid a second
    // zod instance.
    schema: frontmatterSchema.extend({
      date: frontmatterSchema.shape.title.optional(),
    }),
  },
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      addLanguageClass: true,
      themes: {
        light: "github-light",
        dark: "one-dark-pro",
      },
    },
  },
});
