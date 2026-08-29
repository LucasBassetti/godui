# GodUI MCP registry trust policy

## Decision

GodUI keeps the default registry live and freshness-first. A new MCP process
may see a newer catalog after a site deployment, but it must fetch the
versioned `manifest.json` before using registry data. The manifest identifies
the source revision and contains SHA-256 digests for `index.json` and every
component listed in that index. The MCP client fails closed when the manifest
is missing, malformed, revision-pinned to the wrong source, or does not match a
payload's bytes.

This protects against altered, truncated, or mixed-version payloads delivered
between the registry and the MCP process. The default live endpoint still
trusts the first-party HTTPS origin to publish the manifest; a compromise that
replaces both the manifest and its payloads is outside this mode's trust
boundary. High-assurance consumers must use a commit-addressed or otherwise
immutable snapshot URL and set `GODUI_REGISTRY_REVISION` to the approved
manifest revision.

## Release requirements

- Build `apps/docs/public/r/index.json` and `manifest.json` together from the
  reviewed source revision.
- Never overwrite an immutable snapshot used for rollback.
- Update the exact `@godui/mcp` version in the CLI and installation examples
  only after reviewing and publishing the new MCP release.
- Publish MCP releases with npm provenance; never republish an existing npm
  version.

The live endpoint is convenient for normal use. Consumers requiring detached
authentication of the registry origin should add a signed-manifest mode before
using a live endpoint for that threat model.
