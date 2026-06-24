import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/components/mdx";
import { source } from "@/lib/source";
import { Breadcrumbs, type Crumb } from "../_components/breadcrumbs";
import { TocCta } from "../_components/toc-cta";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  const slug = params.slug ?? [];
  const crumbs: Crumb[] = [
    { name: "Docs", url: slug.length ? "/docs" : undefined },
  ];
  if (slug[0] === "components") {
    const atComponentsRoot = slug.length === 1;
    crumbs.push({
      name: "Components",
      url: atComponentsRoot ? undefined : "/docs/components",
    });
    if (!atComponentsRoot) crumbs.push({ name: page.data.title });
  } else if (slug.length) {
    crumbs.push({ name: page.data.title });
  }

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      breadcrumb={{ enabled: false }}
      tableOfContent={{ footer: <TocCta /> }}
      tableOfContentPopover={{ footer: <TocCta /> }}
    >
      <Breadcrumbs crumbs={crumbs} />
      <DocsTitle className="docs-title">{page.data.title}</DocsTitle>
      <DocsDescription className="docs-lead">
        {page.data.description}
      </DocsDescription>
      <hr className="docs-lead-divider" />
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
