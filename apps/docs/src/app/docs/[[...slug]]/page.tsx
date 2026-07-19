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
import { DEPENDENCY_NOTES } from "@/lib/dependency-notes";
import { MOTION_NOTES, STATIC_COMPONENTS } from "@/lib/motion-notes";
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
        <div className="-mb-2 flex items-center justify-between gap-4">
          <Breadcrumbs crumbs={crumbs} />
          {tabs ? <ComponentTabs tabs={tabs} /> : null}
        </div>
      ) : null}
      {isComponentDocsPage ? (
        <ComponentBadges
          perf={motionNote}
          dep={dependencyNote}
          isStatic={isStatic}
        />
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
