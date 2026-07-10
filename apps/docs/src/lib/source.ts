import { docs } from "collections/server";
import { type LoaderPlugin, loader } from "fumadocs-core/source";
import { createElement, Fragment } from "react";
import { NewBadge } from "@/components/new-badge";

/** A component counts as "new" for one month after its frontmatter `date`. */
const NEW_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Appends a "New" badge to any sidebar item whose page frontmatter carries a
 * `date` within the last month. Runs when the page tree is built.
 */
function newBadgePlugin(): LoaderPlugin {
  return {
    name: "godui:new-badge",
    transformPageTree: {
      file(node, filePath) {
        if (!filePath || !("name" in node)) return node;
        const file = this.storage.read(filePath);
        const date =
          file?.format === "page"
            ? (file.data as { date?: string }).date
            : undefined;
        if (date) {
          const time = new Date(date).getTime();
          if (!Number.isNaN(time) && Date.now() - time < NEW_WINDOW_MS) {
            node.name = createElement(
              Fragment,
              null,
              node.name,
              createElement(NewBadge),
            );
          }
        }
        return node;
      },
    },
  };
}

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  plugins: [newBadgePlugin()],
});
