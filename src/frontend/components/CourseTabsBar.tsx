"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import Link from "next/link";
import { COURSE_CATEGORIES } from "@/backend/constants/categories";

const TABS = ["All", ...COURSE_CATEGORIES] as const;

export function CourseTabsBar({
  activeCategory,
  initialQuery = "",
}: {
  activeCategory: string;
  initialQuery?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(Boolean(initialQuery));
  const [query, setQuery] = useState(initialQuery);
  const [pending, startTransition] = useTransition();

  function tabHref(category: string) {
    const sp = new URLSearchParams();
    if (query.trim()) sp.set("q", query.trim());
    if (category !== "All") sp.set("category", category);
    const qs = sp.toString();
    return qs ? `/courses?${qs}` : "/courses";
  }

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const sp = new URLSearchParams();
    if (query.trim()) sp.set("q", query.trim());
    if (activeCategory !== "All") sp.set("category", activeCategory);
    const qs = sp.toString();
    startTransition(() => {
      router.push(qs ? `/courses?${qs}` : "/courses");
    });
  }

  return (
    <div className="glass-panel mb-8 rounded-full px-2 py-2 shadow-lg shadow-sky-900/5">
      <div className="flex items-center gap-1">
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map((cat) => {
            const active = activeCategory === cat;
            return (
              <Link
                key={cat}
                href={tabHref(cat)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-gradient-to-r from-[#5ec2ff] to-[#6b7dff] text-white shadow-md shadow-sky-400/30"
                    : "text-[var(--muted)] hover:bg-white/50 hover:text-[var(--foreground)]"
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        <div className="ml-1 flex shrink-0 items-center gap-1 border-l border-white/50 pl-2">
          {open && (
            <form onSubmit={onSearch} className="flex items-center">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search…"
                className="w-28 rounded-full border border-white/80 bg-glass px-3 py-1.5 text-sm outline-none backdrop-blur placeholder:text-[#9aabba] focus:border-sky-300 sm:w-40"
              />
            </form>
          )}
          <button
            type="button"
            aria-label={open ? "Close search" : "Search courses"}
            disabled={pending}
            onClick={() => {
              if (open && query.trim()) {
                const sp = new URLSearchParams();
                sp.set("q", query.trim());
                if (activeCategory !== "All") sp.set("category", activeCategory);
                startTransition(() => router.push(`/courses?${sp.toString()}`));
                return;
              }
              if (open && !query.trim() && initialQuery) {
                startTransition(() => {
                  router.push(
                    activeCategory === "All"
                      ? "/courses"
                      : `/courses?category=${encodeURIComponent(activeCategory)}`,
                  );
                });
                setOpen(false);
                return;
              }
              setOpen((v) => !v);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--muted)] transition hover:bg-white/60 hover:text-sky-700"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
