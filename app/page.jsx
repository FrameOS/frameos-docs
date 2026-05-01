import Link from "next/link";
import { ArrowRight, BookOpen, Library, Server } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { readDb } from "@/lib/cloud-db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();
  const db = readDb();
  const templates = user ? db.templates.filter((template) => template.ownerId === user.id).slice(0, 4) : db.templates.filter((template) => template.visibility === "public").slice(0, 4);
  const instances = user ? db.backendInstances.filter((instance) => instance.userId === user.id && !instance.revokedAt).slice(0, 3) : [];

  return (
    <main className="pageShell homeShell">
      <section className="consoleHero">
        <div className="consoleCopy">
          <p className="eyebrow">FrameOS</p>
          <h1>{user ? `Welcome back, ${user.name || user.email}` : "Control software for Raspberry Pi display frames"}</h1>
          <p>
            Install the backend, connect a frame over SSH, and deploy scenes to e-ink or LCD displays. Cloud login is here for backend pairing and saving scene templates to frameos.net.
          </p>
          <div className="actionRow">
            <Link className="button primary" href="/docs">
              <BookOpen size={17} />
              Start with the docs
            </Link>
            <Link className="button secondary" href={user ? "/templates" : "/login?returnTo=/templates"}>
              <Library size={17} />
              {user ? "Manage templates" : "Sign in"}
            </Link>
          </div>
        </div>
        <div className="mediaPanel videoPanel">
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            src="https://www.youtube.com/embed/jutMOLQYxSw"
            title="eInk Spectra Case Maker - Waveshare vs Pimoroni"
          />
        </div>
      </section>

      <section className="metricBand" aria-label="FrameOS areas">
        <Link href="/docs">
          <BookOpen size={19} />
          <strong>Docs</strong>
          <span>Install the backend, set up the Raspberry Pi, and pick a display.</span>
        </Link>
        <Link href="/setup">
          <Server size={19} />
          <strong>Backend pairing</strong>
          <span>Connect a self-hosted backend to your frameos.net account.</span>
        </Link>
        <Link href="/templates">
          <Library size={19} />
          <strong>Templates</strong>
          <span>Save scene templates from the backend and manage them here.</span>
        </Link>
      </section>

      <section className="dashboardGrid">
        <div className="panel">
          <div className="sectionHeader">
            <div>
              <p className="eyebrow">Docs</p>
              <h2>Start here</h2>
            </div>
            <Link className="textLink" href="/docs">
              Open <ArrowRight size={15} />
            </Link>
          </div>
          <div className="listRows">
            <Link className="listRow" href="/docs/guide/backend">
              <strong>Install the backend</strong>
              <span>Run FrameOS locally or as a Home Assistant add-on.</span>
            </Link>
            <Link className="listRow" href="/docs/guide/first-deploy">
              <strong>Deploy the first scene</strong>
              <span>Add a frame and send a sample scene to the device.</span>
            </Link>
            <Link className="listRow" href="/docs/devices/devices">
              <strong>Choose a display</strong>
              <span>Waveshare, Pimoroni, HDMI, and other supported panels.</span>
            </Link>
          </div>
        </div>

        <div className="panel">
          <div className="sectionHeader">
            <div>
              <p className="eyebrow">Templates</p>
              <h2>{user ? "Your saved templates" : "Public templates"}</h2>
            </div>
            <Link className="textLink" href={user ? "/templates" : "/login?returnTo=/templates"}>
              Open <ArrowRight size={15} />
            </Link>
          </div>
          {templates.length ? (
            <div className="listRows">
              {templates.map((template) => (
                <div className="listRow" key={template.id}>
                  <strong>{template.name}</strong>
                  <span>{template.description || "No description"}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="emptyState">No templates yet. Save one from FrameOS or create it here.</p>
          )}
        </div>

        <div className="panel">
          <div className="sectionHeader">
            <div>
              <p className="eyebrow">Backend</p>
              <h2>Connected instances</h2>
            </div>
            <Link className="textLink" href={user ? "/setup" : "/login?returnTo=/setup"}>
              Setup <ArrowRight size={15} />
            </Link>
          </div>
          {user && instances.length ? (
            <div className="listRows">
              {instances.map((instance) => (
                <div className="listRow" key={instance.id}>
                  <strong>{instance.name}</strong>
                  <span>{instance.lastSeenAt ? `Last seen ${new Date(instance.lastSeenAt).toLocaleString()}` : "Token created, not used yet"}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="emptyState">{user ? "No backend instances connected yet." : "Sign in to connect a FrameOS backend instance."}</p>
          )}
        </div>
      </section>
    </main>
  );
}
