import { docs } from "collections/server";
import type { Node } from "fumadocs-core/page-tree";
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

/**
 * Component "Learn" articles live at `<component>/learn` so they get their own
 * route + TOC, but they must not appear in the sidebar — they're reached only
 * via the Docs|Learn tab. The `<component>.mdx` file + `<component>/learn.mdx`
 * folder make fumadocs render the component as an expandable group; this plugin
 * drops the learn nodes and collapses the now-empty folder back to its index
 * leaf so the component stays a plain sidebar link. Routing is unaffected —
 * `source.getPage` still resolves the learn page.
 */
function hideLearnPagesPlugin(): LoaderPlugin {
  const prune = (nodes: Node[]): Node[] => {
    const out: Node[] = [];
    for (const node of nodes) {
      if (node.type === "page" && node.url.endsWith("/learn")) continue;
      if (node.type === "folder") {
        const children = prune(node.children);
        if (children.length === 0 && node.index) {
          out.push(node.index);
        } else {
          out.push({ ...node, children });
        }
        continue;
      }
      out.push(node);
    }
    return out;
  };

  return {
    name: "godui:hide-learn-pages",
    transformPageTree: {
      root(tree) {
        return { ...tree, children: prune(tree.children) };
      },
    },
  };
}

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  plugins: [newBadgePlugin(), hideLearnPagesPlugin()],
});
