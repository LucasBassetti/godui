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
      crumbs.push({ name: componentCrumbTitle ?? page.data.title });
    }
  } else if (slug.length) {
    crumbs.push({ name: page.data.title });
  }

  const docsHref = base ? `/docs/${base.join("/")}` : undefined;
  const tabs =
    base && hasLearn && docsHref
      ? [
          { label: "Docs", href: docsHref, active: !isLearnPage },
          { label: "Learn", href: `${docsHref}/learn`, active: isLearnPage },
        ]
      : null;

  // Opt-in full-bleed "Workbench" layout: the whole content area becomes the
  // live preview stage, with docs/code/learn behind a dock + drawer. The MDX
  // body (wrapped in <Workbench>) owns the stage examples + drawer content; the
  // page only supplies metadata the MDX doesn't have (title, badges, crumbs).
  // The workbench renders both the component page AND its `…/learn` route: on the
  // learn route we render the base component's workbench with the Learn drawer
  // pre-opened, so a refresh / deep-link (e.g. `…/learn#motion-score`) reopens
  // the drawer and scrolls to the section instead of showing a bare page.
  const basePageData = base ? source.getPage(base) : null;
  const baseHasWorkbench =
    (basePageData?.data as { workbench?: boolean } | undefined)?.workbench ===
    true;
  const renderWorkbench =
    (isComponentDocsPage &&
      (page.data as { workbench?: boolean }).workbench === true) ||
    (isLearnPage && baseHasWorkbench);
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
    const LearnMDX = learnPage?.data.body;
    const learn = LearnMDX ? (
      <LearnMDX components={getMDXComponents()} />
    ) : null;
    // On the learn route, drive the stage from the base component's MDX and show
    // the component's own title/description in the chip (not the article's).
    const WorkbenchMDX =
      (isLearnPage ? basePageData?.data.body : page.data.body) ??
      page.data.body;
    const chipTitle =
      (isLearnPage ? basePageData?.data.title : page.data.title) ??
      page.data.title;
    const chipDescription =
      (isLearnPage ? basePageData?.data.description : page.data.description) ??
      page.data.description;
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
        {isLearnPage && docsHref ? <SidebarActiveLink href={docsHref} /> : null}
        <WorkbenchProvider
          value={{
            title: chipTitle,
            description: chipDescription,
            badges,
            learnHref: hasLearn && docsHref ? `${docsHref}/learn` : undefined,
            docsHref,
            learn,
            initialDrawerTab: isLearnPage ? "learn" : undefined,
            breadcrumbs: crumbs,
          }}
        >
          <WorkbenchMDX components={getMDXComponents()} />
        </WorkbenchProvider>
      </DocsPage>
    );
  }

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      breadcrumb={{ enabled: false }}
      tableOfContent={{ footer: <TocCta /> }}
      tableOfContentPopover={{ footer: <TocCta /> }}
    >
      {isLearnPage && docsHref ? <SidebarActiveLink href={docsHref} /> : null}
      {crumbs.length > 1 || tabs ? (
        <div className="-mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Breadcrumbs crumbs={crumbs} />
          {tabs ? (
            <ComponentTabs tabs={tabs} className="self-start sm:self-auto" />
          ) : null}
        </div>
      ) : null}
      {isComponentDocsPage ? (
        <ComponentBadges
          score={score}
          scoreHref={
            hasLearn && docsHref ? `${docsHref}/learn#motion-score` : undefined
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
