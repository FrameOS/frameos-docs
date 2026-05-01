import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const DOCS_ROOT = path.join(process.cwd(), "docs");
const BLOG_ROOT = path.join(process.cwd(), "blog");
const DOCS_GROUP_ORDER = new Map([
  ["Overview", 0],
  ["guide", 1],
  ["devices", 2],
]);

const ASSET_EXTENSIONS = new Set([
  ".avif",
  ".gif",
  ".ico",
  ".jpeg",
  ".jpg",
  ".mp4",
  ".png",
  ".svg",
  ".webm",
  ".webp",
]);

function walkFiles(root, extensions) {
  const results = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) {
        continue;
      }

      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (extensions.has(path.extname(entry.name))) {
        results.push(fullPath);
      }
    }
  }

  walk(root);
  return results;
}

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function withoutExtension(value) {
  return value.replace(/\.(md|mdx)$/i, "");
}

function titleFromSlug(value) {
  return value
    .replace(/^\d{4}-\d{2}-\d{2}-/, "")
    .split(/[-_/]/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function firstHeading(markdown) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || null;
}

function parseContent(filePath, root, kind) {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const relativePath = toPosix(path.relative(root, filePath));
  const relativeDir = toPosix(path.dirname(relativePath));
  const stem = withoutExtension(relativePath);
  const fileBase = withoutExtension(path.basename(relativePath));
  const slug = parsed.data.slug
    ? String(parsed.data.slug).replace(/^\/|\/$/g, "")
    : kind === "blog"
      ? fileBase.replace(/^\d{4}-\d{2}-\d{2}-/, "")
      : stem === "intro"
        ? ""
        : stem;

  return {
    kind,
    root,
    filePath,
    relativePath,
    relativeDir: relativeDir === "." ? "" : relativeDir,
    slug,
    href: kind === "blog" ? `/blog/${slug}` : `/docs${slug ? `/${slug}` : ""}`,
    title: parsed.data.title || firstHeading(parsed.content) || titleFromSlug(stem),
    date: parsed.data.date || relativePath.match(/^(\d{4}-\d{2}-\d{2})-/)?.[1] || null,
    sidebarPosition: Number(parsed.data.sidebar_position || 999),
    frontmatter: parsed.data,
    content: parsed.content,
  };
}

export function getAllDocs() {
  return walkFiles(DOCS_ROOT, new Set([".md", ".mdx"]))
    .filter((filePath) => !filePath.endsWith("_category_.json"))
    .map((filePath) => parseContent(filePath, DOCS_ROOT, "docs"))
    .sort((a, b) => a.sidebarPosition - b.sidebarPosition || a.title.localeCompare(b.title));
}

export function getDocBySlug(slugParts = []) {
  const slug = Array.isArray(slugParts) ? slugParts.join("/") : String(slugParts || "");
  const docs = getAllDocs();

  if (!slug) {
    return docs.find((doc) => doc.slug === "") || docs[0] || null;
  }

  return (
    docs.find((doc) => doc.slug === slug) ||
    docs.find((doc) => doc.slug === `${slug}/${path.basename(slug)}`) ||
    null
  );
}

export function getDocsNav() {
  const groups = new Map();

  for (const doc of getAllDocs()) {
    const groupName = doc.relativeDir.split("/")[0] || "Overview";
    if (!groups.has(groupName)) {
      groups.set(groupName, []);
    }
    groups.get(groupName).push(doc);
  }

  return Array.from(groups.entries()).map(([group, items]) => ({
    group: titleFromSlug(group),
    items,
  })).sort((a, b) => {
    const aOrder = DOCS_GROUP_ORDER.get(a.group) ?? DOCS_GROUP_ORDER.get(a.group.toLowerCase()) ?? 99;
    const bOrder = DOCS_GROUP_ORDER.get(b.group) ?? DOCS_GROUP_ORDER.get(b.group.toLowerCase()) ?? 99;
    return aOrder - bOrder || a.group.localeCompare(b.group);
  });
}

export function getAllBlogPosts() {
  return walkFiles(BLOG_ROOT, new Set([".md", ".mdx"]))
    .map((filePath) => parseContent(filePath, BLOG_ROOT, "blog"))
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
}

export function getBlogPost(slug) {
  return getAllBlogPosts().find((post) => post.slug === slug) || null;
}

export function excerptFromMarkdown(markdown, maxLength = 190) {
  const text = markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[[^\]]+\]\([^)]+\)/g, (match) => match.match(/\[([^\]]+)\]/)?.[1] || "")
    .replace(/[#*_>`-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;
}

function normalizeMdx(markdown) {
  return markdown
    .replace(/style=\{\{"aspect-ratio":\s*"([^"]+)"\}\}/g, 'style="aspect-ratio: $1"')
    .replace(/frameborder=/g, "frameBorder=")
    .replace(/referrerpolicy=/g, "referrerPolicy=")
    .replace(/\{\/\*\s*truncate\s*\*\/\}/g, "<!-- truncate -->");
}

function routeForContentLink(url, page) {
  if (
    !url ||
    url.startsWith("#") ||
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:") ||
    url.startsWith("data:")
  ) {
    return url;
  }

  const [rawPath, suffix = ""] = url.split(/(?=[?#])/);
  const ext = path.posix.extname(rawPath).toLowerCase();

  if (rawPath.startsWith("/")) {
    if (rawPath.startsWith("/blog") || rawPath.startsWith("/docs") || rawPath.startsWith("/content")) {
      return url;
    }

    if (ASSET_EXTENSIONS.has(ext)) {
      return `/content/static${rawPath}${suffix}`;
    }

    return `/docs${rawPath}${suffix}`;
  }

  const sourceRoot = page.kind === "blog" ? "blog" : "docs";
  const resolved = path.posix.normalize(path.posix.join(page.relativeDir, rawPath));

  if (resolved.startsWith("../docs/")) {
    return `/content/docs/${resolved.replace("../docs/", "")}${suffix}`;
  }

  if (resolved.startsWith("../blog/")) {
    return `/content/blog/${resolved.replace("../blog/", "")}${suffix}`;
  }

  if (ASSET_EXTENSIONS.has(ext)) {
    return `/content/${sourceRoot}/${resolved}${suffix}`;
  }

  if (ext === ".md" || ext === ".mdx") {
    const contentPath = withoutExtension(resolved);
    return page.kind === "blog" ? `/blog/${contentPath}${suffix}` : `/docs/${contentPath}${suffix}`;
  }

  if (!ext && page.kind === "docs") {
    return `/docs/${resolved.replace(/^\/+/, "")}${suffix}`;
  }

  return url;
}

export function renderMarkdown(page) {
  const markdown = normalizeMdx(page.content);
  const html = marked.parse(markdown, {
    async: false,
    breaks: false,
    gfm: true,
  });

  return String(html).replace(/\b(src|href)="([^"]+)"/g, (_match, attr, value) => {
    return `${attr}="${routeForContentLink(value, page)}"`;
  });
}
