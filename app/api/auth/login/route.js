import { authenticatePassword, jsonWithSession } from "@/lib/auth";
import { badRequest, readJson } from "@/lib/http";

export async function POST(request) {
  const body = await readJson(request);
  const user = authenticatePassword(body.email, body.password);

  if (!user) {
    return badRequest("Invalid email or password.", 401);
  }

  return jsonWithSession(user);
}
