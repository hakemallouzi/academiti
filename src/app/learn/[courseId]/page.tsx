import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/backend/auth/session";
import { getLessonForLearner } from "@/backend/services/progress";
import { LessonNotesReader } from "@/frontend/components/LessonNotesReader";
import { CompleteLessonButton } from "@/frontend/components/CompleteLessonButton";
import { prisma } from "@/backend/db/prisma";

export default async function LearnPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ lesson?: string }>;
}) {
  const user = await requireUser();
  const { courseId } = await params;
  const { lesson } = await searchParams;

  const data = await getLessonForLearner(user.id, courseId, lesson);
  if (!data) {
    redirect(`/courses`);
  }

  const { course, current, progress } = data;
  if (!current) notFound();

  const completedIds = new Set(
    progress.filter((p) => p.completed).map((p) => p.lessonId),
  );
  const doneCount = course.lessons.filter((l) => completedIds.has(l.id)).length;
  const progressPct = Math.round((doneCount / course.lessons.length) * 100) || 0;
  const allDone = doneCount === course.lessons.length;

  const currentIndex = course.lessons.findIndex((l) => l.id === current.id);
  const prevLesson = currentIndex > 0 ? course.lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < course.lessons.length - 1
      ? course.lessons[currentIndex + 1]
      : null;

  const certificate = allDone
    ? await prisma.certificate.findUnique({
        where: { userId_courseId: { userId: user.id, courseId } },
      })
    : null;

  return (
    <div className="relative flex h-[calc(100svh-4.75rem)] w-full flex-col overflow-hidden lg:flex-row">
      <div className="pointer-events-none absolute -left-[10%] -top-[20%] h-[50%] w-[50%] rounded-full bg-sky-300/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-[10%] bottom-[10%] h-[40%] w-[40%] rounded-full bg-blue-300/20 blur-[100px]" />

      <aside className="relative z-10 flex h-48 shrink-0 flex-col border-b border-white/50 bg-glass lg:h-full lg:w-80 lg:border-b-0 lg:border-r">
        <div className="shrink-0 border-b border-white/15 p-5">
          <div className="mb-2 inline-block rounded-full border border-sky-300/40 bg-sky-500/10 px-3 py-1 backdrop-blur">
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
              {course.language} · {course.level}
            </span>
          </div>
          <h1 className="font-[family-name:var(--font-display)] text-lg font-bold leading-snug text-[#1f2d3d]">
            {course.title}
          </h1>
          <div className="mt-4 flex items-center gap-3">
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/50 shadow-inner">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-[var(--muted)]">
              {progressPct}%
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-3 [scrollbar-width:thin]">
          {course.lessons.map((l) => {
            const done = completedIds.has(l.id);
            const active = l.id === current.id;
            return (
              <Link
                key={l.id}
                href={`/learn/${courseId}?lesson=${l.id}`}
                className={`relative flex w-full items-start gap-3 overflow-hidden rounded-xl border p-3 text-left transition ${
                  active
                    ? "border-sky-400/40 bg-sky-500/10 shadow-[0_4px_24px_rgba(56,189,248,0.12)] backdrop-blur-xl"
                    : done
                      ? "border-white/20 bg-white/40 backdrop-blur-md hover:bg-white/60"
                      : "border-white/10 bg-white/20 opacity-80 hover:bg-white/40 hover:opacity-100"
                }`}
              >
                {active && (
                  <span className="absolute bottom-0 left-0 top-0 w-1 bg-sky-500 shadow-[0_0_12px_rgba(56,189,248,0.8)]" />
                )}
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] ${
                    active
                      ? "border-sky-500 bg-sky-500 text-white shadow-[0_0_10px_rgba(56,189,248,0.4)]"
                      : done
                        ? "border-sky-300/50 bg-sky-500/10 text-sky-700"
                        : "border-white/40 bg-white/40 text-[var(--muted)]"
                  }`}
                >
                  {done ? "✓" : active ? "▶" : l.order}
                </span>
                <span className="min-w-0">
                  <span
                    className={`block text-sm font-semibold ${
                      active ? "text-sky-800" : "text-[#1f2d3d]"
                    }`}
                  >
                    {l.order}. {l.title}
                  </span>
                  <span
                    className={`mt-1 block text-[11px] ${
                      active ? "text-sky-700/80" : "text-[var(--muted)]"
                    }`}
                  >
                    {active ? (
                      <span className="inline-flex items-center gap-1">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-500" />
                        Current · ~{l.durationMin} min
                      </span>
                    ) : (
                      `~${l.durationMin} min`
                    )}
                  </span>
                </span>
              </Link>
            );
          })}
        </nav>

        {certificate && (
          <div className="shrink-0 border-t border-white/15 p-3">
            <Link
              href={`/certificates/${certificate.id}`}
              className="btn-glass-primary block rounded-full px-3 py-2.5 text-center text-sm font-semibold"
            >
              View certificate
            </Link>
          </div>
        )}
      </aside>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4 sm:flex-row sm:p-6">
        <div className="min-h-0 min-w-0 flex-1">
          <LessonNotesReader
            text={current.body}
            title={current.title}
            language={course.language}
          />
        </div>

        <div className="flex w-full shrink-0 flex-col justify-between gap-4 sm:w-56">
          <div className="relative overflow-hidden rounded-2xl border border-white/50 bg-sky-100/40 p-4 shadow-lg backdrop-blur-xl">
            <div className="pointer-events-none absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-sky-300/30 blur-xl" />
            <h4 className="relative z-10 mb-3 text-[11px] font-semibold uppercase tracking-wider text-sky-800">
              Resources
            </h4>
            <ul className="relative z-10 space-y-2">
              <li>
                <div className="flex items-center gap-3 rounded-lg p-2 text-sm text-sky-900/80">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white bg-white/28 shadow-sm">
                    ♪
                  </span>
                  Voice narration
                </div>
              </li>
              <li>
                <div className="flex items-center gap-3 rounded-lg p-2 text-sm text-sky-900/80">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white bg-white/28 shadow-sm">
                    ✦
                  </span>
                  Certificate track
                </div>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <CompleteLessonButton
              lessonId={current.id}
              courseId={courseId}
              completed={completedIds.has(current.id)}
            />

            {prevLesson ? (
              <Link
                href={`/learn/${courseId}?lesson=${prevLesson.id}`}
                className="flex items-center justify-center gap-2 rounded-full border border-white/80 bg-glass px-4 py-3 text-sm font-semibold text-[var(--muted)] shadow-sm backdrop-blur transition hover:bg-white/45"
              >
                ← Previous
              </Link>
            ) : null}

            {nextLesson ? (
              <Link
                href={`/learn/${courseId}?lesson=${nextLesson.id}`}
                className="btn-glass-primary flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold"
              >
                Next lesson →
              </Link>
            ) : allDone && certificate ? (
              <Link
                href={`/certificates/${certificate.id}`}
                className="btn-glass-primary flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold"
              >
                Get certificate →
              </Link>
            ) : (
              <span className="rounded-full border border-white/40 bg-white/30 px-4 py-3 text-center text-sm text-[var(--muted)]">
                Last lesson
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
