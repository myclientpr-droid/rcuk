"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  Menu,
  X,
  Search,
  Heart,
  Globe,
  Info,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About RCUK",
    columns: [
      [
        { label: "About RCUK", href: "/about-rcuk" },
        { label: "Governance Structure", href: "/governance-structure" },
        { label: "History of the Arakan", href: "/history-of-the-rohingya" },
      ],
      [
        { label: "Rohingya Culture", href: "/rohingya-culture" },
        { label: "Advocacy & Rights", href: "/advocacy-human-rights" },
      ],
    ],
  },
  {
    label: "What We Do",
    columns: [
      [
        { label: "What We Do", href: "/what-we-do" },
        { label: "Get Support", href: "/get-support" },
        { label: "Language Services", href: "/language-services" },
      ],
      [
        { label: "Campaigns", href: "/campaigns" },
        { label: "Rohingya Solidarity Campaign", href: "/rohingya-solidarity-campaign" },
      ],
    ],
  },
  {
    label: "News and Stories",
    columns: [
      [
        { label: "News & Updates", href: "/news" },
        { label: "Announcements", href: "/news?category=statements" },
        { label: "Press Releases", href: "/news?category=press-release" },
      ],
    ],
  },
  {
    label: "Get Involved",
    columns: [
      [
        { label: "Get Involved", href: "/get-involved" },
        { label: "Events", href: "/events" },
        { label: "Volunteer Opportunities", href: "/volunteer-opportunities" },
        { label: "Become a Member", href: "/become-a-member" },
      ],
      [
        { label: "Become a Friend of Rohingya", href: "/become-a-friend-of-rohingya" },
        { label: "Affiliate to RCUK", href: "/affiliate-to-rcuk" },
        { label: "Take Action", href: "/take-action" },
      ],
      [
        { label: "Resources", href: "/resources" },
        { label: "FAQ", href: "/faq" },
        { label: "Donate", href: "/donate" },
        { label: "Contact Us", href: "/contact-us" },
      ],
    ],
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setActiveDropdown(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="sticky top-0 z-50 w-full">
      <header className="relative top-0 left-0 z-50 w-full font-sans">
        
        {/* ============ DESKTOP + MOBILE TOP BAR ============ */}
        <div className="border-b border-gray-100 bg-white py-1.5 xl:py-0.5">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="-ml-1 rounded p-1 text-gray-800 hover:bg-gray-50 lg:hidden"
              >
                <Menu size={26} strokeWidth={2} />
              </button>

              <a href="/" className="flex items-center gap-2" aria-label="Rohingya Centre UK home">
                <Image
                  src="/logos/rcuk-logo.png"
                  width={176}
                  height={48}
                  alt="Rohingya Centre UK"
                  priority
                  className="h-11 w-auto"
                />
              </a>
            </div>

            <div className="hidden flex-1 items-center justify-end gap-3 lg:flex">
              <div
                className={`flex items-center overflow-hidden rounded-full border transition-all duration-200 ${
                  desktopSearchOpen ? "w-72 border-gray-300 px-3" : "w-0 border-transparent"
                }`}
              >
                {desktopSearchOpen && (
                  <>
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search"
                      className="h-9 flex-1 text-sm outline-none"
                    />
                    <Search size={16} className="text-gray-400" />
                  </>
                )}
              </div>

              <IconButton
                icon={desktopSearchOpen ? X : Search}
                label={desktopSearchOpen ? "Close" : "Search"}
                onClick={() => setDesktopSearchOpen((v) => !v)}
                style="text-rc-navy"
              />
              <IconButton icon={Globe} label="Sites" onClick={() => {}} style="text-rc-navy" />

              <CTAButton icon={Heart} label="Donate" href="/donate" style="text-white bg-rc-red hover:bg-[#a80101]" />
              <CTAButton icon={Info} label="Get Help" href="/get-support" style="text-rc-navy bg-rc-gold hover:brightness-105" />
            </div>

            <div className="flex items-center gap-6 lg:hidden">
              <IconButton
                icon={mobileSearchOpen ? X : Search}
                compact
                onClick={() => setMobileSearchOpen((v) => !v)}
              />
              <IconButton icon={Globe} compact onClick={() => {}} />
            </div>
          </div>

          {mobileSearchOpen && (
            <div className="border-t border-gray-100 px-4 py-3 lg:hidden">
              <div className="flex items-center rounded-full border border-gray-300 px-3">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search"
                  className="h-10 flex-1 text-sm outline-none"
                />
                <Search size={16} className="text-gray-400" />
              </div>
            </div>
          )}
{/*donation and help button on medium size device*/}
          {!scrolled && !mobileSearchOpen && (
            <div className="flex gap-3 border-t border-gray-100 px-4 py-1 lg:hidden">
              <a
                href="/donate"
                className="flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium bg-rc-red text-white"
              >
                <Heart size={16} /> DONATE
              </a>
              <a
                href="/get-support"
                className="flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium bg-rc-gold text-rc-navy"
              >
                <Info size={16} /> GET HELP
              </a>
            </div>
          )}
        </div>

        {/* ============ DESKTOP NAV ROW + MEGA MENU ============ */}
        <nav ref={navRef} className="w-full relative mx-auto hidden border-b-[3px] border-rc-red bg-rc-navy lg:block">
          <ul className="mx-auto flex max-w-7xl items-center justify-center gap-8 px-4 py-2">
            {NAV_ITEMS.map((item) => {
              const isOpen = activeDropdown === item.label;
              const hasDropdown = !!item.columns;

              // Route match: true if the current page is this item's own destination
              // or any of its dropdown links
              const isActiveRoute = hasDropdown ? item.columns.some((col) => col.some(
                      (link) => pathname === link.href || pathname.startsWith(link.href + "/")
                    )
                  )
                : pathname === item.href;
                
              // highlight the active route 
              const isHighlighted = isActiveRoute;
              const highlightStyle = {
                backgroundColor: isHighlighted ? "#cc0102" : "transparent",
                color: "#FFFFFF",
              };

              if (!hasDropdown) {
                // Home: plain link, nothing to toggle, so no ambiguity
                return (
                  <li key={item.label} className="relative">
                    <a
                      href={item.href}
                      className="flex min-w-20 justify-center px-2 items-center gap-1 py-4 text-sm font-bold transition-colors hover:bg-white/10"
                      style={highlightStyle}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              }

              // Items with a dropdown: trigger is a BUTTON, not a link — it can only
              // ever toggle the menu. The item's own destination page lives as the
              // first link inside item.columns, same pattern as the Red Cross reference.
              return (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    onClick={() =>
                      setActiveDropdown((prev) => (prev === item.label ? null : item.label))
                    }
                    className="flex min-w-20 justify-center px-2 items-center gap-1 py-4 text-sm font-bold transition-colors hover:bg-white/10"
                    style={highlightStyle}
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="absolute left-1/2 top-full w-[640px] -translate-x-1/2 border border-gray-100 bg-white shadow-lg">
                      <div className="flex divide-x divide-gray-200 px-8 py-6">
                        {item.columns.map((col, i) => (
                          <div key={i} className="flex-1 space-y-3 px-6 first:pl-0">
                            {col.map((link) => (
                              <a
                                key={link.label}
                                href={link.href}
                                className="flex items-center gap-2 text-sm text-gray-700 hover:text-rc-red"
                              >
                                {link.label}
                              </a>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ============ MOBILE SLIDE-OVER MENU ============ */}
        {mobileOpen && (
          <div className="fixed inset-0 z-[60] flex lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />

            <div className="relative flex h-full w-full max-w-sm flex-col overflow-y-auto bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div className="flex flex-col items-start gap-1 text-xs text-gray-600">
                  <Globe size={22} />
                  Sites
                </div>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="rounded p-1 hover:bg-gray-50"
                >
                  <X size={26} />
                </button>
              </div>

              <div className="flex-1 divide-y divide-gray-100">
                {NAV_ITEMS.filter((i) => i.label !== "Home").map((item) => {
                  const expanded = mobileExpanded === item.label;
                  const isActiveRoute = item.columns.some((col) =>
                    col.some(
                      (link) => pathname === link.href || pathname.startsWith(link.href + "/")
                    )
                  );
                  return (
                    <div key={item.label}>
                      <button
                        type="button"
                        onClick={() => setMobileExpanded(expanded ? null : item.label)}
                        className="flex w-full items-center justify-between px-5 py-2 text-left text-md md:text-xl font:semibold md:font-bold"
                        style={{ color: expanded || isActiveRoute ? "#cc0102" : "#1A1A1A" }}
                      >
                        {item.label}
                        <ChevronRight
                          size={22}
                          className={`transition-transform ${expanded ? "rotate-90" : ""}`}
                        />
                      </button>

                      {expanded && item.columns && (
                        <div className="space-y-4 bg-gray-50 px-5 pb-5">
                          {item.columns.flat().map((link) => (
                            <a
                              key={link.label}
                              href={link.href}
                              className="flex items-center gap-2 py-1 text-base text-gray-800"
                            >
                              {link.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-3 border-t border-gray-100 p-5">
                <a
                  href="/donate"
                  className="flex flex-1 items-center justify-center gap-2 rounded-md py-3 text-sm font-semibold bg-rc-red text-white"
                >
                  <Heart size={16} /> DONATE
                </a>
                <a
                  href="/get-support"
                  className="flex flex-1 items-center justify-center gap-2 rounded-md py-3 text-sm font-semibold bg-rc-gold text-rc-navy"
                >
                  <Info size={16} /> GET HELP
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

function IconButton({ icon: Icon, label, onClick, compact, style }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex flex-col items-center gap-0.5 text-gray-700 hover:text-[color:inherit]",
        compact ? "" : "px-1",
        style
      )}
    >
      <Icon size={20} style={{ color: "#010165" }} />
    </button>
  );
}

function CTAButton({ icon: Icon, label, style, href }) {
  return (
    <a
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-bold whitespace-nowrap",
        style
      )}
    >
      <Icon size={16} /> {label.toUpperCase()}
    </a>
  );
}
