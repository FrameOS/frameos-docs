import { unstable_cache } from "next/cache";

export const RELEASES_REVALIDATE_SECONDS = 60 * 60;
const GITHUB_RELEASES_URL = "https://api.github.com/repos/FrameOS/frameos/releases";

function publicAsset(asset) {
  return {
    id: asset.id,
    name: asset.name,
    size: asset.size,
    downloadCount: asset.download_count,
    browserDownloadUrl: asset.browser_download_url,
    contentType: asset.content_type,
    createdAt: asset.created_at,
    updatedAt: asset.updated_at,
  };
}

export function publicRelease(release) {
  return {
    id: release.id,
    tagName: release.tag_name,
    name: release.name || release.tag_name,
    body: release.body || "",
    htmlUrl: release.html_url,
    draft: release.draft,
    prerelease: release.prerelease,
    createdAt: release.created_at,
    publishedAt: release.published_at,
    assets: (release.assets || []).map(publicAsset),
  };
}

async function fetchGithubReleases() {
  const response = await fetch(GITHUB_RELEASES_URL, {
    headers: {
      accept: "application/vnd.github+json",
      "user-agent": "FrameOS Cloud",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub releases request failed with ${response.status}.`);
  }

  const releases = await response.json();
  return releases.filter((release) => !release.draft).map(publicRelease);
}

export const getGithubReleases = unstable_cache(fetchGithubReleases, ["frameos-github-releases"], {
  revalidate: RELEASES_REVALIDATE_SECONDS,
});

export async function getLatestRelease() {
  const releases = await getGithubReleases();
  return releases.find((release) => !release.prerelease) || releases[0] || null;
}

export function formatReleaseDate(value) {
  if (!value) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}
