import Link from "next/link";
import { BookOpen, LogIn, Package, SquareStack } from "lucide-react";
import { AccountMenu } from "@/components/AccountMenu";

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
        <Link href="/releases">
          <Package size={17} />
          Releases
        </Link>
      </nav>

      <div className="accountNav">
        {user ? (
          <AccountMenu user={user} />
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
