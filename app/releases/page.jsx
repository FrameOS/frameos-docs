import Link from "next/link";
import { ArrowUpRight, Box, Calendar, Package } from "lucide-react";
import { formatReleaseDate, getGithubReleases } from "@/lib/github-releases";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "FrameOS Releases",
  description: "Cached GitHub releases for FrameOS.",
};

function releaseBodyPreview(body) {
  const text = String(body || "").trim();
  if (!text) {
    return "No release notes published.";
  }
  return text.length > 520 ? `${text.slice(0, 520).trim()}...` : text;
}

export default async function ReleasesPage() {
  let releases = [];
  let error = "";

  try {
    releases = await getGithubReleases();
  } catch (releaseError) {
    error = releaseError.message;
  }

  return (
    <main className="pageShell releasesShell">
      <section className="sectionHeader pageHeader">
        <div>
          <p className="eyebrow">GitHub</p>
          <h1>FrameOS releases</h1>
          <p>Cached from the FrameOS GitHub releases API.</p>
        </div>
        <Link className="button secondary" href="https://github.com/FrameOS/frameos/releases">
          <ArrowUpRight size={17} />
          GitHub
        </Link>
      </section>

      {error ? <p className="notice danger">Could not load GitHub releases: {error}</p> : null}

      <section className="releaseList">
        {releases.map((release) => (
          <article className="releaseCard" key={release.id}>
            <div className="releaseCardHeader">
              <div>
                <p className="eyebrow">{release.prerelease ? "Pre-release" : "Release"}</p>
                <h2>{release.name}</h2>
              </div>
              <Link className="iconButton" href={release.htmlUrl} title="Open release on GitHub">
                <ArrowUpRight size={17} />
              </Link>
            </div>
            <div className="releaseMeta">
              <span>
                <Package size={15} />
                {release.tagName}
              </span>
              <span>
                <Calendar size={15} />
                {formatReleaseDate(release.publishedAt || release.createdAt)}
              </span>
              <span>
                <Box size={15} />
                {release.assets.length} assets
              </span>
            </div>
            <pre className="releaseNotes">{releaseBodyPreview(release.body)}</pre>
          </article>
        ))}
      </section>
    </main>
  );
}
