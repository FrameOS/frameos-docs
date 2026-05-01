import { NextResponse } from "next/server";
import { authError, getRequestUser } from "@/lib/auth";
import { mutateDb, nowIso } from "@/lib/cloud-db";
import { badRequest, readJson } from "@/lib/http";

export async function GET(request, { params }) {
  const { id } = await params;
  const user = getRequestUser(request);
  const template = mutateDb((db) => db.templates.find((item) => item.id === id));

  if (!template || (template.visibility !== "public" && template.ownerId !== user?.id)) {
    return NextResponse.json({ error: "Template not found." }, { status: 404 });
  }

  return NextResponse.json({ template });
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const user = getRequestUser(request);
  if (!user) {
    return authError();
  }

  const body = await readJson(request);
  const updated = mutateDb((db) => {
    const template = db.templates.find((item) => item.id === id && item.ownerId === user.id);
    if (!template) {
      return null;
    }

    if (body.name !== undefined) {
      const name = String(body.name || "").trim();
      if (!name) {
        throw new Error("Template name is required.");
      }
      template.name = name;
    }

    if (body.description !== undefined) {
      template.description = String(body.description || "").trim();
    }

    if (body.visibility !== undefined) {
      template.visibility = body.visibility === "public" ? "public" : "private";
    }

    if (body.tags !== undefined) {
      template.tags = Array.isArray(body.tags)
        ? body.tags.map((tag) => String(tag).trim()).filter(Boolean)
        : String(body.tags || "")
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
    }

    if (body.content !== undefined || body.template !== undefined) {
      template.content = body.content ?? body.template;
    }

    template.updatedAt = nowIso();
    return template;
  });

  if (!updated) {
    return NextResponse.json({ error: "Template not found." }, { status: 404 });
  }

  return NextResponse.json({ template: updated });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const user = getRequestUser(request);
  if (!user) {
    return authError();
  }

  const deleted = mutateDb((db) => {
    const before = db.templates.length;
    db.templates = db.templates.filter((item) => !(item.id === id && item.ownerId === user.id));
    return db.templates.length !== before;
  });

  if (!deleted) {
    return NextResponse.json({ error: "Template not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
