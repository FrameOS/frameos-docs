import { NextResponse } from "next/server";

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export function badRequest(error, status = 400) {
  return NextResponse.json({ error }, { status });
}

export function safeReturnTo(value, fallback = "/") {
  if (typeof value === "string" && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return fallback;
}
