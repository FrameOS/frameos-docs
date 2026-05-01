import { NextResponse } from "next/server";
import { createUserWithPassword, jsonWithSession } from "@/lib/auth";
import { badRequest, readJson } from "@/lib/http";

export async function POST(request) {
  const body = await readJson(request);
  const email = String(body.email || "").trim();
  const password = String(body.password || "");
  const name = String(body.name || "").trim();

  if (!email.includes("@")) {
    return badRequest("Enter a valid email address.");
  }

  if (password.length < 8) {
    return badRequest("Use at least 8 characters for the password.");
  }

  try {
    const user = createUserWithPassword({ name, email, password });
    return jsonWithSession(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 409 });
  }
}
