# frameos.net

The FrameOS website and documentation, served at [frameos.net](https://frameos.net).

Built with [Next.js](https://nextjs.org/) and [Fumadocs](https://fumadocs.dev/), exported as a
fully static site.

## Editing content

All content is plain Markdown/MDX:

- `content/docs/guide/` — the guide (`/guide/...`)
- `content/docs/devices/` — device pages (`/devices/...`)
- `content/docs/cases/`, `content/docs/faq.mdx` — `/cases`, `/faq`
- `content/blog/` — blog posts; the file name is the URL slug, the date lives in frontmatter
- `meta.json` files control sidebar order

Frontmatter is `title` + `description` (+ `date` for blog posts). Images live in `public/images/`
and are referenced as `/images/...`.

The landing page is `app/(home)/page.tsx` — the photo slideshow, app-tour slides, and feature
cards are plain data arrays at the top of that file.

## Development

```bash
npm install
npm run dev          # dev server on http://localhost:3000
npm run build        # static export into out/
npm run start        # serve out/ locally
```

Deploy by serving the `out/` directory from any static host. `public/install.sh` is served at
https://frameos.net/install.sh — keep that path intact, the main repo's README curls it.
