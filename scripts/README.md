# Device database scripts

The device database at `/devices` is powered by plain MDX files in
[`content/docs/devices/`](../content/docs/devices/) - one file per display. The `device:`
frontmatter block in each file is the database record (vendor, resolution, colors, driver id,
tested status, …); it feeds the searchable table on the index page and the spec card on the
device's own page. The markdown body below the frontmatter is free-form prose.

**To fix or extend a device page, just edit its MDX file - no scripts needed.**

## Adding new drivers

When FrameOS gains new display drivers:

1. Add the new entries to `device-data.json` (same shape as the existing ones). The Waveshare
   entries were originally dumped from `backend/app/drivers/waveshare.py` in the main repo.
2. Run:

   ```bash
   node scripts/generate-device-pages.mjs
   ```

The generator only creates files that don't exist yet - hand-edited pages are never touched.
Use `--dry-run` to preview and `--force` to overwrite generated pages.

One gotcha when picking slugs: a slug must not equal another slug plus a numeric suffix
(e.g. `foo` and `foo-7`) - fumadocs' search indexer derives document ids as `<url>-<counter>`,
so such pairs collide and break `next build`. That's why the 2025 Inky Impressions live at
`*-2025` slugs and the Python fallback at `pimoroni-inky-impression-python`.

## Marking a device as tested

Edit the device's MDX file: set `status: "tested"` in the frontmatter and replace the
`## Status` section's text. That's the whole process - perfect for community PRs.
