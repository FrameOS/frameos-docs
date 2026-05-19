import { NextResponse } from "next/server";
import { backendAuthExchangeResponse, exchangeBackendAuthCode } from "@/lib/cloud-backend-auth";
import { badRequest, readJson } from "@/lib/http";

export async function POST(request) {
  const body = await readJson(request);
  const code = String(body.code || "").trim();

  if (!code) {
    return badRequest("code is required.");
  }

  const result = exchangeBackendAuthCode({
    code,
    backendName: body.backendName,
    backendUrl: body.backendUrl,
  });

  if (!result) {
    return badRequest("Invalid or expired cloud auth code.", 401);
  }

  return NextResponse.json(backendAuthExchangeResponse(result));
}
