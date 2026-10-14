"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MAIN_NAV, type NavItem } from "@/lib/navigation";
import { useModal } from "@/components/modals/ModalProvider";
import { ChevronDown, CloseIcon, MenuIcon } from "@/components/ui/Icons";
import type { WPImage } from "@/types/wp";

function isActive(item: NavItem, pathname: string): boolean {
  if (item.children) return item.children.some((c) => isActive(c, pathname));
  if (item.href === "/") return pathname === "/";
  return item.href !== "#" && pathname.startsWith(item.href);
}

export function Header({ logo, ctaLabel }: { logo: WPImage | null; ctaLabel: string }) {
  const pathname = usePathname();
  const { open } = useModal();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Close the mobile menu after navigating.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
    setExpanded(null);
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[9999] bg-white shadow-header">
        <div className="container-site flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href="/" className="shrink-0" aria-label="Home">
            {logo && (
              <Image
                src={logo.url}
                alt={logo.alt || "Logo"}
                width={logo.width}
                height={logo.height}
                priority
                className="h-[36px] w-auto lg:h-[42px]"
              />
            )}
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-[35px]">
              {MAIN_NAV.map((item) => (
                <li key={item.label} className="group relative">
                  {item.children ? (
                    <button
                      type="button"
                      aria-haspopup="true"
                      className={`flex items-center gap-2 py-2.5 font-medium transition-colors hover:text-primary ${isActive(item, pathname) ? "text-primary" : "text-ink"}`}
                    >
                      {item.label}
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={`block py-2.5 font-medium transition-colors hover:text-primary ${isActive(item, pathname) ? "text-primary" : "text-ink"}`}
                    >
                      {item.label}
                    </Link>
                  )}
                  {item.children && (
                    <ul className="invisible absolute left-0 top-full min-w-[280px] bg-tint-strong opacity-0 shadow-md transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={`block px-5 py-[13px] font-medium transition-colors hover:bg-primary hover:text-white ${isActive(child, pathname) ? "text-primary" : "text-ink"}`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {ctaLabel && (
              <button
                type="button"
                onClick={() => open({ type: "get_in_touch" })}
                className="hidden bg-primary-bright px-[15px] py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary sm:block"
              >
                {ctaLabel}
              </button>
            )}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="p-1 text-primary lg:hidden"
            >
              {mobileOpen ? <CloseIcon className="h-7 w-7" /> : <MenuIcon className="h-7 w-7" />}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className={`overflow-hidden border-t border-tint bg-white transition-[max-height] duration-300 lg:hidden ${mobileOpen ? "max-h-[80vh] overflow-y-auto" : "max-h-0"}`}
        >
          <ul className="container-site py-2">
            {MAIN_NAV.map((item) => (
              <li key={item.label} className="border-b border-tint last:border-0">
                {item.children ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setExpanded((v) => (v === item.label ? null : item.label))}
                      aria-expanded={expanded === item.label}
                      className={`flex w-full items-center justify-between py-3 font-medium ${isActive(item, pathname) ? "text-primary" : "text-ink"}`}
                    >
                      {item.label}
                      <ChevronDown className={`h-3 w-3 transition-transform ${expanded === item.label ? "rotate-180" : ""}`} />
                    </button>
                    {expanded === item.label && (
                      <ul className="mb-2 bg-tint-strong">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link href={child.href} className="block px-4 py-3 font-medium text-ink hover:text-primary">
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`block py-3 font-medium ${isActive(item, pathname) ? "text-primary" : "text-ink"}`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
            {ctaLabel && (
              <li className="pt-3 sm:hidden">
                <button
                  type="button"
                  onClick={() => open({ type: "get_in_touch" })}
                  className="w-full bg-primary-bright px-[15px] py-2.5 text-sm font-medium text-white"
                >
                  {ctaLabel}
                </button>
              </li>
            )}
          </ul>
        </nav>
      </header>
      {/* Spacer so page content starts below the fixed header */}
      <div aria-hidden="true" className="h-[var(--header-h)]" />
    </>
  );
}
