"use client";

import { useState } from "react";

type Lesson = {
  id: string;
  title: string;
  order: number;
  durationMin: number;
  body: string;
};

export function SyllabusAccordion({ lessons }: { lessons: Lesson[] }) {
  const [openId, setOpenId] = useState<string | null>(lessons[0]?.id ?? null);

  return (
    <div className="flex flex-col gap-2">
      {lessons.map((lesson) => {
        const open = openId === lesson.id;
        const preview =
          lesson.body.replace(/\s+/g, " ").trim().slice(0, 180) +
          (lesson.body.length > 180 ? "…" : "");
        const num = String(lesson.order).padStart(2, "0");

        return (
          <div
            key={lesson.id}
            className={`overflow-hidden rounded-2xl border border-white/50 transition ${
              open
                ? "bg-white/70 shadow-md shadow-sky-900/5 backdrop-blur-md"
                : "bg-white/40 backdrop-blur-md hover:bg-white/60"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenId(open ? null : lesson.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <div className="flex min-w-0 items-center gap-4">
                <span className="font-[family-name:var(--font-display)] text-lg font-semibold text-sky-500/70">
                  {num}
                </span>
                <span className="truncate font-semibold text-[#1f2d3d]">
                  {lesson.title}
                </span>
              </div>
              <span
                className={`shrink-0 text-[#7a8b9c] transition ${open ? "rotate-180" : ""}`}
              >
                ⌄
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ${
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="space-y-2 px-5 pb-5 pl-[3.75rem]">
                  <p className="text-sm leading-relaxed text-[var(--muted)]">
                    {preview}
                  </p>
                  <p className="text-xs font-medium text-sky-700">
                    ~{lesson.durationMin} min · Voice narration included
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
