import { NextResponse } from "next/server";
import { getGithubReleases, RELEASES_REVALIDATE_SECONDS } from "@/lib/github-releases";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const releases = await getGithubReleases();
    return NextResponse.json(
      { releases },
      {
        headers: {
          "cache-control": `public, s-maxage=${RELEASES_REVALIDATE_SECONDS}, stale-while-revalidate=${RELEASES_REVALIDATE_SECONDS}`,
        },
      },
    );
  } catch (error) {
    return NextResponse.json({ error: error.message, releases: [] }, { status: 502 });
  }
}
