---
name: update-docs
description: Catch frameos.net up with what changed in the main FrameOS repo since the last docs sync. Reads the recorded SHA in last-sync.json, walks the FrameOS commits since then, edits the guide/device/FAQ pages that describe the changed behaviour, builds, and records the new SHA. Use when the user says "update docs", "sync docs with frameos", "catch up the docs".
---

# Update docs from the FrameOS repo

The docs describe FrameOS *as a user sees it*. This skill turns "what changed in the code since
last time" into edits on the guide pages, device pages and FAQ - and moves the bookmark.

## 0. Where things are

- Docs (this repo): `/Users/marius/Projects/FrameOS/frameos-docs`. Pages are MDX under
  `content/docs/guide/`, `content/docs/devices/`, `content/docs/faq.mdx`; blog under `content/blog/`.
- FrameOS source: `/Users/marius/Projects/FrameOS/frameos` (`git@github.com:FrameOS/frameos.git`).
  Use its local `main` as-is; do not fetch/pull unless the user asks.
- The bookmark: `.claude/skills/update-docs/last-sync.json` in this repo:

  ```json
  { "frameos_sha": "…", "frameos_version": "2026.8.43", "synced_at": "2026-08-29", "docs_commit": "…" }
  ```

- No global `node`: use `.flox/run/aarch64-darwin.frameos-docs.dev/bin/{node,npm,npx}`.

## 1. Find the delta

```bash
cd /Users/marius/Projects/FrameOS/frameos
BASE=$(python3 -c "import json;print(json.load(open('/Users/marius/Projects/FrameOS/frameos-docs/.claude/skills/update-docs/last-sync.json'))['frameos_sha'])")
git log --format='%h %ad %s' --date=short $BASE..HEAD            # the list
git log --format='=== %h %ad %s%n%b' --date=short $BASE..HEAD | grep -v 'Co-Authored-By\|Claude-Session'   # the bodies
git diff --stat $BASE..HEAD -- docs/ README.md embedded/esp32/README.md AGENTS.md
cat versions.json                                                # current version string
```

The commit bodies are the primary source - they are detailed and say what a user sees. The
body log is often 50-100 KB: it gets persisted to a file; read it in ~350-line slices with
`sed -n`. Ignore `chore: version …`, merges, CI, lint, snapshot updates, and internal refactors
with no visible effect.

Then read the docs-side diffs that matter to users, with the exact paths (zsh: quote globs,
`--include='*.py'`):

- `embedded/esp32/README.md` - console commands, power/battery, presets, memory rules
- `docs/cloud-frames.md` - the cloud↔frame protocol; version gates for settings (`from firmware 2026.x.y`)
- `backend/app/tasks/embedded_firmware.py` - ESP32 hardware presets (battery, buttons, power policy)
- `frontend/src/devices.ts` - the display driver list (new panels appear here)
- `cloud/apps/auth-web/app/**/page.tsx` - copy of new cloud pages (grep for the feature)
- `README.md` / `AGENTS.md` - occasionally

## 2. Map changes to pages

| Topic | Page |
| --- | --- |
| ESP32 firmware, boards, flashing, console, power/battery, canvas/memory | `guide/esp32.mdx` (+ the board's `devices/*.mdx`) |
| Cloud account, add-frame flows, frame management, limits, API tokens/MCP | `guide/cloud.mdx` |
| scenes.frameos.net: scene page, preview, my scenes, AI, publishing | `guide/scene-store.mdx` |
| Scene editor, state fields, execution mode, preview | `guide/scenes.mdx` |
| JS/Nim apps, config fields, imports | `guide/apps.mdx` |
| Frame settings (time zone, HTTP size, power, SSH keys, builds) | `guide/settings.mdx` |
| Local HTTP API, admin panel, scheduler | `guide/control.mdx` |
| Backend install, HA add-on, dev setup, cloud link | `guide/backend.mdx` |
| Pi images, SD builder, status screen | `guide/raspberry.mdx`, `guide/standalone.mdx`, `guide/first-deploy.mdx` |
| Image decoding, memory, degrade | `guide/images.mdx` |
| Remote (agent), Pico, virtual frames | `guide/remote.mdx`, `guide/pico.mdx`, `guide/virtual.mdx` |
| Anything a newcomer would ask | `faq.mdx` |
| New display driver / board | `devices/<slug>.mdx` + `scripts/device-data.json` |

Every guide page starts with a callout saying which of the three ways (standalone / backend /
cloud) it applies to - keep new paragraphs consistent with that.

## 3. Edit

- Update in place; match the pages' voice (plain, direct, second person, dashes not em dashes,
  British-ish spelling as on the page). Prefer changing a sentence over adding a section.
- Mention the version a feature needs when the code gates on it (`firmware 2026.8.39+`).
- Don't document internals (log line names, struct fields) unless a user would grep for them.
- Exact-match replacement is safest: a small Python script with `(old, new)` pairs that asserts
  each `old` occurs once - see `git show` of a previous sync commit for the pattern.

### New display driver

1. Add an entry to `scripts/device-data.json` (copy a sibling; `slug` must not equal another
   slug plus a numeric suffix - fumadocs search ids collide, e.g. `foo` and `foo-7`).
2. Either run `node scripts/generate-device-pages.mjs` (creates missing pages only) or copy the
   closest sibling page and adjust. Pages under `content/docs/devices/` are the source of truth;
   the sitemap picks them up automatically.
3. Waveshare panels are ESP32-capable unless listed in `esp32UnsupportedWavesharePanels` in the
   generator (10.3" IT8951, 12.48"). Boards use `platforms:` in frontmatter.
4. Mark `status: "tested"` only when a commit says it was verified on hardware.

### New all-in-one board / preset

Add a row to the **Supported boards** table in `guide/esp32.mdx`, a device page with the preset
name, pins, buttons and battery wiring, and a link from `devices/index.mdx` if it's a new family.

## 4. Verify

```bash
export PATH="$PWD/.flox/run/aarch64-darwin.frameos-docs.dev/bin:$PATH"
npm run build      # static export; fails on bad MDX, broken frontmatter, slug collisions
```

Run it in the background (a few minutes). Grep the log for `Error` / `exit=`.

## 5. Record and commit

1. Write `last-sync.json` with FrameOS `git rev-parse HEAD`, the `frameos` version from
   `versions.json`, today's date.
2. Commit the docs with a message like `Docs: catch up with FrameOS 2026.8.43` and a body listing
   the user-facing changes per page (see `git log --grep 'catch up with FrameOS'`). Fill in
   `docs_commit` after committing (`git rev-parse HEAD`) and amend, or leave it for next time -
   `frameos_sha` is the one that matters.
3. Tell the user what changed, and what you deliberately skipped (blog-worthy features, things
   you couldn't verify).
