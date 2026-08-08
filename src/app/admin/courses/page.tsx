import Link from "next/link";
import { requireAdmin } from "@/backend/auth/session";
import { prisma } from "@/backend/db/prisma";
import { formatPrice } from "@/backend/services/courses";
import { deleteCourseAction } from "@/backend/actions";

export default async function AdminCoursesPage() {
  await requireAdmin();
  const courses = await prisma.course.findMany({
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { lessons: true } } },
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-teal-950">
          Courses
        </h1>
        <Link
          href="/admin/courses/new"
          className="rounded-xl bg-teal-900 px-4 py-2 text-sm font-semibold text-[#f7f3eb]"
        >
          New course
        </Link>
      </div>

      <ul className="mt-8 space-y-3">
        {courses.map((c) => (
          <li
            key={c.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/80 bg-glass px-4 py-3"
          >
            <div>
              <p className="font-semibold text-teal-950">
                {c.title}{" "}
                {!c.published && (
                  <span className="text-xs font-normal text-amber-700">(draft)</span>
                )}
              </p>
              <p className="text-sm text-stone-500">
                {c.language} · {c.level} · {c._count.lessons} lessons ·{" "}
                {formatPrice(c.priceCents)}
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              <Link href={`/admin/courses/${c.id}`} className="text-teal-800 hover:underline">
                Edit / lessons
              </Link>
              <form action={deleteCourseAction.bind(null, c.id)}>
                <button type="submit" className="text-red-700 hover:underline">
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
