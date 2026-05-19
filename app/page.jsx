import Link from "next/link";
import { ArrowRight, BookOpen, LogIn, Monitor, SquareStack } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { excerptFromMarkdown, getAllBlogPosts } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();
  const posts = getAllBlogPosts().slice(0, 3);

  return (
    <main className="pageShell homeShell">
      <section className="consoleHero">
        <div className="consoleCopy">
          <p className="eyebrow">FrameOS</p>
          <h1>
            {user ? (
              <>
                Welcome back,
                <br />
                {user.name || user.email}
              </>
            ) : (
              "Control software for Raspberry Pi display frames"
            )}
          </h1>
          <p>
            Install the backend, connect a frame over SSH, and deploy scenes to e-ink or LCD displays. Start with the guide, then pick the hardware that matches your display.
          </p>
          <div className="actionRow">
            <Link className="button primary" href="/docs">
              <BookOpen size={17} />
              Start with the docs
            </Link>
            <Link className="button secondary" href={user ? "/blog" : "/login"}>
              {user ? <SquareStack size={17} /> : <LogIn size={17} />}
              {user ? "Read updates" : "Sign in"}
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
        <Link href="/docs/devices/devices">
          <Monitor size={19} />
          <strong>Devices</strong>
          <span>Find setup notes for Waveshare, Pimoroni, HDMI, and other panels.</span>
        </Link>
        <Link href="/blog">
          <SquareStack size={19} />
          <strong>Blog</strong>
          <span>Follow build guides, project updates, and hardware notes.</span>
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
              <p className="eyebrow">Devices</p>
              <h2>Supported hardware</h2>
            </div>
            <Link className="textLink" href="/docs/devices/devices">
              Open <ArrowRight size={15} />
            </Link>
          </div>
          <div className="listRows">
            <Link className="listRow" href="/docs/devices/pimoroni-inky-impression-7.3inch-eink">
              <strong>Pimoroni Inky Impression</strong>
              <span>Notes for the 7.3 inch full color e-ink panel.</span>
            </Link>
            <Link className="listRow" href="/docs/devices/waveshare-7.5inch-800x480-epaper">
              <strong>Waveshare e-paper</strong>
              <span>Setup notes for common Waveshare e-paper displays.</span>
            </Link>
            <Link className="listRow" href="/docs/devices/framebuffer-hdmi">
              <strong>HDMI framebuffer</strong>
              <span>Use a TV, monitor, or other HDMI display.</span>
            </Link>
          </div>
        </div>

        <div className="panel">
          <div className="sectionHeader">
            <div>
              <p className="eyebrow">Blog</p>
              <h2>Latest updates</h2>
            </div>
            <Link className="textLink" href="/blog">
              Open <ArrowRight size={15} />
            </Link>
          </div>
          <div className="listRows">
            {posts.map((post) => (
              <Link className="listRow" href={post.href} key={post.href}>
                <strong>{post.title}</strong>
                <span>{excerptFromMarkdown(post.content, 95)}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
