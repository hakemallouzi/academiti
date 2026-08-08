"use client";

import { useRef } from "react";
import Link from "next/link";
import { CourseCard } from "@/frontend/components/CourseCard";

export type SliderCourse = {
  id: string;
  title: string;
  slug: string;
  description: string;
  language: string;
  level: string;
  category?: string;
  priceCents: number;
  thumbnail: string | null;
  _count?: { lessons: number };
};

export function CategoryCourseSlider({
  category,
  courses,
}: {
  category: string;
  courses: SliderCourse[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(360, el.clientWidth * 0.8);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  if (courses.length === 0) return null;

  return (
    <section className="rounded-[2rem] border border-white/80 bg-glass p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_40px_rgba(90,120,150,0.08)] sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-sky-300/70 bg-white/28 text-[10px] text-sky-600">
            ◆
          </span>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a8b9c]">
            {category}
          </h2>
          <span className="rounded-full bg-white/28 px-2.5 py-0.5 text-[11px] text-[var(--muted)]">
            {courses.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/courses?category=${encodeURIComponent(category)}`}
            className="mr-1 hidden text-xs font-medium text-sky-700 hover:underline sm:inline"
          >
            View all
          </Link>
          <button
            type="button"
            aria-label={`Scroll ${category} left`}
            onClick={() => scrollBy(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/30 text-[#5a6b7c] shadow-sm backdrop-blur-md transition hover:border-sky-300 hover:bg-white/50 hover:text-sky-700"
          >
            ←
          </button>
          <button
            type="button"
            aria-label={`Scroll ${category} right`}
            onClick={() => scrollBy(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/30 text-[#5a6b7c] shadow-sm backdrop-blur-md transition hover:border-sky-300 hover:bg-white/50 hover:text-sky-700"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-5 overflow-x-auto pb-2 scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {courses.map((course, i) => (
          <div
            key={course.id}
            className="w-[min(86vw,300px)] shrink-0 sm:w-[300px]"
          >
            <CourseCard course={course} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
