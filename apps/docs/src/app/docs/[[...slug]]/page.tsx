import { MOTION_TIER_META } from "@godui/components";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComponentBadges } from "@/components/component-badges";
import { LearnPlayerProvider } from "@/components/learn/learn-player-context";
import { getMDXComponents } from "@/components/mdx";
import {
  type BadgeItem,
  WorkbenchProvider,
} from "@/components/workbench/workbench-context";
import { DEPENDENCY_NOTES } from "@/lib/dependency-notes";
import { MOTION_NOTES, STATIC_COMPONENTS } from "@/lib/motion-notes";
import { motionScore } from "@/lib/motion-score";
import { source } from "@/lib/source";
import { Breadcrumbs, type Crumb } from "../_components/breadcrumbs";
import { ComponentTabs } from "../_components/component-tabs";
import { SidebarActiveLink } from "../_components/sidebar-active-link";
import { TocCta } from "../_components/toc-cta";
import { WorkbenchPreviewCard } from "../_components/workbench-preview-card";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  const slug = params.slug ?? [];
  const inComponents = slug[0] === "components";
  // Component base = `components/<category>/<name>` (depth 3). The Learn page is
  // that base + `learn` (depth 4). Badges + tabs hang off the base.
  const base = inComponents && slug.length >= 3 ? slug.slice(0, 3) : undefined;
  const isLearnPage = base != null && slug.length === 4 && slug[3] === "learn";
  const isComponentDocsPage = base != null && slug.length === 3;

  // The Learn tab only appears when a learn page actually exists for this
  // component. `source.getPage` returns null when it doesn't.
  const learnPage = base ? source.getPage([...base, "learn"]) : null;
  const hasLearn = learnPage != null;

  const componentName = base ? base[2] : undefined;
  const motionNote = componentName ? MOTION_NOTES[componentName] : undefined;
  const dependencyNote = componentName
    ? DEPENDENCY_NOTES[componentName]
    : undefined;
  const isStatic = componentName ? STATIC_COMPONENTS.has(componentName) : false;
  // Static components (the `*-background` effects) never animate — no grade to show;
  // they keep only the green "Static" badge.
  const score =
    componentName && !isStatic ? motionScore(componentName) : undefined;

  // On the Learn page, `page.data.title` is the article title — but the
  // breadcrumb should still read the component's name (pulled from the base
  // docs page), with the Learn tab conveying which sub-page you're on.
  const componentCrumbTitle = base
    ? isLearnPage
      ? (source.getPage(base)?.data.title ?? page.data.title)
      : page.data.title
    : undefined;

  const crumbs: Crumb[] = [
    { name: "Docs", url: slug.length ? "/docs" : undefined },
  ];
  if (inComponents) {
    const atComponentsRoot = slug.length === 1;
    crumbs.push({
      name: "Components",
      url: atComponentsRoot ? undefined : "/docs/components",
    });
    if (!atComponentsRoot) {
      // On the Learn page the component crumb links back to its docs page, and a
      // trailing "Learn" crumb marks where you are (the Docs/Learn tabs are gone
      // in the stage-first layout).
      const componentHref = base ? `/docs/${base.join("/")}` : undefined;
      crumbs.push({
        name: componentCrumbTitle ?? page.data.title,
        url: isLearnPage ? componentHref : undefined,
      });
      if (isLearnPage) crumbs.push({ name: "Learn" });
    }
  } else if (slug.length) {
    crumbs.push({ name: page.data.title });
  }

  const docsHref = base ? `/docs/${base.join("/")}` : undefined;
  const tabs =
    base && hasLearn && docsHref
      ? [
          {
            label: "Docs",
            href: docsHref,
            active: !isLearnPage,
            icon: "docs" as const,
          },
          {
            label: "Learn",
            href: `${docsHref}/learn`,
            active: isLearnPage,
            icon: "learn" as const,
          },
        ]
      : null;

  // Opt-in full-bleed "Workbench" layout: the whole content area becomes the
  // live preview stage, with the prose in a resizable pane beside it. The MDX
  // body (wrapped in <Workbench>) owns the stage examples + pane content; the
  // page only supplies metadata the MDX doesn't have (title, badges, crumbs).
  //
  // Learn is deliberately NOT a workbench route. Its articles are built from
  // ScrollScene, which needs real width, and they're the best long-form content
  // on the site — they get the standard doc column with a TOC below.
  const renderWorkbench =
    isComponentDocsPage &&
    (page.data as { workbench?: boolean }).workbench === true;
  if (renderWorkbench) {
    // Compact meta items for the title chip (dot + label + hover tooltip) — the
    // workbench uses a cleaner inline row than the classic <ComponentBadges>.
    const PERF_LABEL = { layout: "Layout", paint: "Paint", compute: "Compute" };
    const badges: BadgeItem[] = [];
    if (score) {
      const meta = MOTION_TIER_META[score.grade];
      badges.push({
        tone: "sky",
        label: `Motion ${score.grade}`,
        title: `${score.grade} — ${meta.name}`,
        detail: `${meta.summary} ${score.reason}`,
        href:
          hasLearn && docsHref ? `${docsHref}/learn#motion-score` : undefined,
        hrefLabel: "Motion Score table",
      });
    }
    if (motionNote) {
      badges.push({
        tone: "amber",
        label: PERF_LABEL[motionNote.kind],
        title: "Not fully GPU-composited",
        detail: motionNote.reason,
      });
    } else if (isStatic) {
      badges.push({
        tone: "emerald",
        label: "Static",
        title: "No animation",
        detail:
          "Renders with plain CSS and never animates — nothing for the browser to keep composing or repainting.",
      });
    } else {
      badges.push({
        tone: "emerald",
        label: "GPU-only",
        title: "Runs on the GPU compositor",
        detail:
          "Animates only transform, opacity and filter — no main-thread layout or paint, so it stays smooth even under load.",
      });
    }
    if (dependencyNote) {
      badges.push({
        tone: "violet",
        label: "Dependency",
        title: "Beyond React, Tailwind & Motion",
        detail: `Uses ${dependencyNote.pkg} to ${dependencyNote.reason}.`,
      });
    }
    return (
      <DocsPage
        full
        toc={[]}
        breadcrumb={{ enabled: false }}
        // The stage is the whole page — no prev/next page footer.
        footer={{ enabled: false }}
        // Zero the article padding + max-width so the stage fills the main grid
        // column edge-to-edge. `workbench-page` also cancels the desktop
        // `#nd-page { padding-top: 1.5rem !important }` rule (which would
        // otherwise overflow 100dvh and cause a scroll).
        className="workbench-page max-w-none gap-0 p-0 md:p-0 xl:p-0"
      >
        <WorkbenchProvider
          value={{
            title: page.data.title,
            description: page.data.description,
            badges,
            learnHref: hasLearn && docsHref ? `${docsHref}/learn` : undefined,
            docsHref,
            breadcrumbs: crumbs,
          }}
        >
          <MDX components={getMDXComponents()} />
        </WorkbenchProvider>
      </DocsPage>
    );
  }

  // Learn routes get a live miniature of the component they're about, plus a way
  // back to its workbench — the article can't show you the thing itself.
  const tocFooter =
    isLearnPage && componentName && docsHref ? (
      <>
        <WorkbenchPreviewCard
          slug={componentName}
          href={docsHref}
          title={componentCrumbTitle ?? page.data.title}
        />
        <TocCta />
      </>
    ) : (
      <TocCta />
    );

  // The stage-first Learn layout renders the article title + description *below*
  // its pinned preview (via <LearnPlayer>), so the page suppresses the default
  // title/badges here and widens the column to give the stage room.
  const isLearnPlayer =
    isLearnPage &&
    (page.data as { learnPlayer?: boolean }).learnPlayer === true;

  return (
    <DocsPage
      toc={isLearnPlayer ? [] : page.data.toc}
      full={page.data.full || isLearnPlayer}
      breadcrumb={{ enabled: false }}
      // The stage-first layout is self-navigating (chapter rail) and fills the
      // full content width, so it drops the right TOC column entirely.
      tableOfContent={
        isLearnPlayer ? { enabled: false } : { footer: tocFooter }
      }
      tableOfContentPopover={
        isLearnPlayer ? { enabled: false } : { footer: tocFooter }
      }
      className={isLearnPlayer ? "learn-player-page max-w-none" : undefined}
    >
      {isLearnPage && docsHref ? <SidebarActiveLink href={docsHref} /> : null}
      {crumbs.length > 1 || tabs ? (
        <div className="-mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Breadcrumbs crumbs={crumbs} />
          {tabs && !isLearnPlayer ? (
            <ComponentTabs tabs={tabs} className="self-start sm:self-auto" />
          ) : null}
        </div>
      ) : null}
      {isLearnPlayer ? (
        <LearnPlayerProvider
          value={{
            title: page.data.title,
            description: page.data.description,
          }}
        >
          <DocsBody>
            <MDX components={getMDXComponents()} />
          </DocsBody>
        </LearnPlayerProvider>
      ) : (
        <>
          {isComponentDocsPage ? (
            <ComponentBadges
              score={score}
              scoreHref={
                hasLearn && docsHref
                  ? `${docsHref}/learn#motion-score`
                  : undefined
              }
              perf={motionNote}
              dep={dependencyNote}
              isStatic={isStatic}
            />
          ) : isLearnPage ? (
            <ComponentBadges placeholder />
          ) : null}
          <DocsTitle className="docs-title">{page.data.title}</DocsTitle>
          <DocsDescription className="docs-lead">
            {page.data.description}
          </DocsDescription>
          <DocsBody>
            <MDX components={getMDXComponents()} />
          </DocsBody>
        </>
      )}
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(
  props: PageProps<"/docs/[[...slug]]">,
): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
