import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const installScript = path.join(process.cwd(), "static", "install.sh");

  if (!fs.existsSync(installScript)) {
    return NextResponse.json({ error: "Install script not found." }, { status: 404 });
  }

  return new NextResponse(fs.readFileSync(installScript), {
    headers: {
      "content-type": "text/x-shellscript; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
