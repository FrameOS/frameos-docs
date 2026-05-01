import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

const ROOTS = {
  docs: path.join(process.cwd(), "docs"),
  blog: path.join(process.cwd(), "blog"),
  static: path.join(process.cwd(), "static"),
};

const TYPES = {
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

export async function GET(_request, { params }) {
  const { path: parts } = await params;
  const [rootName, ...rest] = parts || [];
  const root = ROOTS[rootName];

  if (!root || rest.length === 0) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const resolved = path.resolve(root, ...rest);
  if (!resolved.startsWith(root) || !fs.existsSync(resolved) || fs.statSync(resolved).isDirectory()) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const body = fs.readFileSync(resolved);
  return new NextResponse(body, {
    headers: {
      "content-type": TYPES[path.extname(resolved).toLowerCase()] || "application/octet-stream",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
