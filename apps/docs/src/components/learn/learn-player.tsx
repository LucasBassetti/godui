import { Children, isValidElement, type ReactNode } from "react";
import {
  LearnChapter,
  type LearnChapterProps,
} from "@/components/learn/learn-chapter";
import { LearnPlayerClient } from "@/components/learn/learn-player-client";

/**
 * Server-side entry for the stage-first Learn layout. It partitions its MDX
 * children — every <LearnChapter> becomes a carousel step — then hands the
 * split to the interactive client shell. Prose (the chapter's children) and the
 * scene element both cross the server → client boundary intact.
 *
 * The partition MUST happen here (a server component): MDX creates <LearnChapter>
 * from the same reference this module imports, so `child.type === LearnChapter`
 * matches. Across the boundary that identity is lost, so partitioning inside the
 * client shell would find zero chapters.
 */
export function LearnPlayer({ children }: { children: ReactNode }) {
  const chapters: LearnChapterProps[] = [];

  for (const child of Children.toArray(children)) {
    if (isValidElement(child) && child.type === LearnChapter) {
      chapters.push(child.props as LearnChapterProps);
    }
  }

  return (
    <LearnPlayerClient
      chapters={chapters.map((c) => ({
        label: c.label,
        scene: c.scene,
        code: c.code,
        lang: c.lang ?? "tsx",
        isResult: c.isResult ?? false,
        prose: c.children,
      }))}
    />
  );
}
