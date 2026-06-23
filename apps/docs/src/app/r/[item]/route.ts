import { buildBackgroundRegistryItem } from "@godui/components/registry";
import type { NextRequest } from "next/server";

// Background items are served dynamically (not by `shadcn build`) so the CLI can
// bake a chosen variant's CSS via `?variant=`. Every other registry item is a
// static file in public/r and never reaches this handler.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ item: string }> },
) {
  const { item } = await params;
  const name = item.replace(/\.json$/, "");
  const variant = request.nextUrl.searchParams.get("variant") ?? undefined;
  const registryItem = buildBackgroundRegistryItem(name, variant);
  if (!registryItem) {
    return new Response("Not found", { status: 404 });
  }
  return Response.json(registryItem);
}
