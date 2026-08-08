import { notFound } from "next/navigation";
import { requireAdmin } from "@/backend/auth/session";
import { prisma } from "@/backend/db/prisma";
import { CourseForm } from "@/frontend/components/admin/CourseForm";
import {
  deleteLessonAction,
  upsertLessonAction,
} from "@/backend/actions";

export default async function AdminCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: { lessons: { orderBy: { order: "asc" } } },
  });
  if (!course) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-teal-950">
        Edit course
      </h1>
      <CourseForm course={course} />

      <section className="mt-16">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-teal-950">
          Lessons
        </h2>
        <ul className="mt-4 space-y-3">
          {course.lessons.map((lesson) => (
            <li
              key={lesson.id}
              className="rounded-xl border border-white/80 bg-glass p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {lesson.order}. {lesson.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-stone-500">
                    {lesson.body}
                  </p>
                </div>
                <form action={deleteLessonAction.bind(null, lesson.id, course.id)}>
                  <button type="submit" className="text-sm text-red-700">
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="mt-10 text-lg font-semibold text-teal-950">Add lesson</h3>
        <form action={upsertLessonAction} className="mt-4 space-y-3">
          <input type="hidden" name="courseId" value={course.id} />
          <input
            name="title"
            required
            placeholder="Lesson title"
            className="w-full rounded-xl border border-stone-300 px-3 py-2"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              name="order"
              type="number"
              required
              defaultValue={course.lessons.length + 1}
              className="rounded-xl border border-stone-300 px-3 py-2"
            />
            <input
              name="durationMin"
              type="number"
              defaultValue={10}
              className="rounded-xl border border-stone-300 px-3 py-2"
            />
          </div>
          <textarea
            name="body"
            required
            rows={8}
            placeholder="Lesson text (read aloud by voice player)"
            className="w-full rounded-xl border border-stone-300 px-3 py-2"
          />
          <button
            type="submit"
            className="rounded-xl bg-teal-900 px-4 py-2 text-sm font-semibold text-[#f7f3eb]"
          >
            Add lesson
          </button>
        </form>
      </section>
    </div>
  );
}
