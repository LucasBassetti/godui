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
      // When true, the component docs page renders in the full-bleed
      // "Workbench" layout (live stage + dock + drawer) instead of the classic
      // linear column. Opt-in per page so un-migrated pages keep the old layout.
      workbench: frontmatterSchema.shape.full.optional(),
      // When true, a Learn page renders in the stage-first <LearnPlayer> layout
      // (pinned preview + chapter rail) and its auto-TOC is suppressed. Opt-in
      // per page so un-migrated Learn articles keep the classic scroll layout.
      learnPlayer: frontmatterSchema.shape.full.optional(),
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
