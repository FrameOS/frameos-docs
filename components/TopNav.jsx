import Link from "next/link";
import { BookOpen, LogIn, SquareStack } from "lucide-react";

export function TopNav({ user }) {
  return (
    <header className="topbar">
      <Link className="brand" href="/">
        <span className="brandMark">F</span>
        <span>
          <strong>FrameOS</strong>
          <small>Cloud</small>
        </span>
      </Link>

      <nav className="navLinks" aria-label="Primary navigation">
        <Link href="/docs">
          <BookOpen size={17} />
          Docs
        </Link>
        <Link href="/blog">
          <SquareStack size={17} />
          Blog
        </Link>
      </nav>

      <div className="accountNav">
        {user ? (
          <>
            <span className="accountPill">{user.name || user.email}</span>
            <a className="button ghost small" href="/logout">
              Sign out
            </a>
          </>
        ) : (
          <Link className="button primary small" href="/login">
            <LogIn size={16} />
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
}
