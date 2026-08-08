import { CourseCard } from "@/frontend/components/CourseCard";
import { CategoryCourseSlider } from "@/frontend/components/CategoryCourseSlider";
import { CourseTabsBar } from "@/frontend/components/CourseTabsBar";
import { COURSE_CATEGORIES } from "@/backend/constants/categories";
import { listPublishedCourses } from "@/backend/services/courses";

export const metadata = { title: "Courses" };

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
  }>;
}) {
  const params = await searchParams;
  const activeCategory = params.category || "All";
  const isAll = activeCategory === "All";

  const courses = await listPublishedCourses({
    q: params.q,
    category: activeCategory,
  });

  const grouped = COURSE_CATEGORIES.map((category) => ({
    category,
    courses: courses.filter((c) => c.category === category),
  })).filter((g) => g.courses.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full border border-sky-300/70 bg-white/28 text-[10px] text-sky-600">
            ◆
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a8b9c]">
            Catalog
          </p>
        </div>
        <h1 className="chrome-text font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight sm:text-5xl">
          Courses
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--muted)]">
          Browse by category and earn a verifiable certificate when you finish.
        </p>
      </div>

      <CourseTabsBar
        activeCategory={activeCategory}
        initialQuery={params.q || ""}
      />

      {isAll ? (
        courses.length === 0 ? (
          <div className="rounded-[2rem] border border-white/80 bg-glass p-10 text-center text-[var(--muted)]">
            No courses match your search.
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map((group) => (
              <CategoryCourseSlider
                key={group.category}
                category={group.category}
                courses={group.courses}
              />
            ))}
          </div>
        )
      ) : (
        <div className="rounded-[2rem] border border-white/80 bg-glass p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_40px_rgba(90,120,150,0.08)] sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-sky-300/70 bg-white/28 text-[10px] text-sky-600">
                ◆
              </span>
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a8b9c]">
                {activeCategory}
              </h2>
            </div>
            <p className="text-xs text-[var(--muted)]">
              {courses.length} result{courses.length === 1 ? "" : "s"}
            </p>
          </div>

          {courses.length === 0 ? (
            <p className="py-12 text-center text-[var(--muted)]">
              No courses in this category yet.
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, i) => (
                <CourseCard key={course.id} course={course} index={i} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
