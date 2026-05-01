import { NextResponse } from "next/server";
import { getRequestUser } from "@/lib/auth";
import { publicUser } from "@/lib/cloud-db";

export async function GET(request) {
  return NextResponse.json({ user: publicUser(getRequestUser(request)) });
}
