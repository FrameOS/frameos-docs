"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ChevronDown, Cloud, LogOut, Server, UserCircle } from "lucide-react";

export function AccountMenu({ user }) {
  const menuRef = useRef(null);
  const pathname = usePathname();

  function closeMenu() {
    if (menuRef.current) {
      menuRef.current.open = false;
    }
  }

  useEffect(() => {
    closeMenu();
  }, [pathname]);

  useEffect(() => {
    function closeOnOutsideClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <details className="accountMenu" ref={menuRef}>
      <summary className="accountSummary">
        <UserCircle size={18} />
        <span>My account</span>
        <ChevronDown size={15} />
      </summary>
      <div className="accountMenuPanel">
        <span className="accountPill">{user.name || user.email}</span>
        <Link href="/account/backends" onClick={closeMenu}>
          <Server size={16} />
          Connected backends
        </Link>
        <Link href="/backups" onClick={closeMenu}>
          <Cloud size={16} />
          Encrypted backups
        </Link>
        <a href="/logout" onClick={closeMenu}>
          <LogOut size={16} />
          Sign out
        </a>
      </div>
    </details>
  );
}
