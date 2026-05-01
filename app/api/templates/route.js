import { NextResponse } from "next/server";
import { getRequestUser, authError } from "@/lib/auth";
import { mutateDb, nowIso } from "@/lib/cloud-db";
import { badRequest, readJson } from "@/lib/http";
import { randomId } from "@/lib/security";

function templateForUser(template, user) {
  return template.ownerId === user.id || template.visibility === "public";
}

export async function GET(request) {
  const user = getRequestUser(request);
  const url = new URL(request.url);
  const mine = url.searchParams.get("mine") !== "0";

  const templates = mutateDb((db) => {
    return db.templates
      .filter((template) => (mine ? user && template.ownerId === user.id : templateForUser(template, user || {})))
      .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
  });

  return NextResponse.json({ templates });
}

export async function POST(request) {
  const user = getRequestUser(request);
  if (!user) {
    return authError("Cloud login is required before saving templates to frameos.net.");
  }

  const body = await readJson(request);
  const name = String(body.name || "").trim();
  const description = String(body.description || "").trim();
  const tags = Array.isArray(body.tags)
    ? body.tags.map((tag) => String(tag).trim()).filter(Boolean)
    : String(body.tags || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
  const visibility = body.visibility === "public" ? "public" : "private";

  if (!name) {
    return badRequest("Template name is required.");
  }

  const content = body.content ?? body.template ?? {};

  const template = mutateDb((db) => {
    const item = {
      id: randomId("tpl"),
      ownerId: user.id,
      name,
      description,
      tags,
      visibility,
      content,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    db.templates.push(item);
    return item;
  });

  return NextResponse.json({ template }, { status: 201 });
}
