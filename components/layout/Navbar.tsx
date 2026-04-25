"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { href: "/", label: "Trang chủ" },
  { href: "/vocabulary", label: "Từ vựng" },
  { href: "/grammar", label: "Ngữ pháp" },
  { href: "/notebook", label: "Sổ tay" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-surface-container-lowest/80 border-b border-outline-variant/20 min-h-[64px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 cursor-pointer flex items-center"
            aria-label="Huyên Korean — Trang chủ"
          >
            <Image
              src="/logo.svg"
              alt="Huyên Korean"
              width={156}
              height={42}
              priority
              className="h-9 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => {
              const isActive =
                href === "/"
                  ? pathname === "/"
                  : pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? "text-primary bg-primary-container/60"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu((v) => !v)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-surface-container transition-colors duration-200 cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-on-surface max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <span className="material-symbols-outlined text-sm text-on-surface-variant">
                    expand_more
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-surface-container-lowest rounded-2xl shadow-xl shadow-on-surface/10 border border-outline-variant/20 overflow-hidden z-50 animate-[fade-in_0.15s_ease-out]">
                    <div className="px-4 py-3 border-b border-outline-variant/15">
                      <p className="text-sm font-semibold text-on-surface truncate">{user.name}</p>
                      <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                    </div>
                    <div className="p-1">
                      <Link
                        href="/notebook"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-on-surface hover:bg-surface-container transition-colors duration-150 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base text-on-surface-variant">menu_book</span>
                        Sổ tay của tôi
                      </Link>
                      <button
                        onClick={() => { setShowUserMenu(false); logout(); }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-error hover:bg-error-container/20 transition-colors duration-150 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base">logout</span>
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:block text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors duration-200 px-3 py-2 cursor-pointer"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="md:hidden flex items-center gap-1 px-4 pb-2 overflow-x-auto">
          {navLinks.map(({ href, label }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`shrink-0 px-3 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? "text-primary bg-primary-container/60"
                    : "text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </header>
    </>
  );
}
