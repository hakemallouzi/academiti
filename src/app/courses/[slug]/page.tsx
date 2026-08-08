import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionUser } from "@/backend/auth/session";
import { getCourseBySlug } from "@/backend/services/courses";
import { formatPrice } from "@/lib/format";
import { isEnrolled } from "@/backend/services/orders";
import { AddToCartButton } from "@/frontend/components/AddToCartButton";
import { SyllabusAccordion } from "@/frontend/components/SyllabusAccordion";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  return { title: course?.title ?? "Course" };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const user = await getSessionUser();
  const enrolled = user ? await isEnrolled(user.id, course.id) : false;
  const totalMin = course.lessons.reduce((sum, l) => sum + l.durationMin, 0);
  const weeks = Math.max(1, Math.ceil(totalMin / 60));
  const heroImage =
    course.thumbnail ||
    "https://images.unsplash.com/photo-1456513080880-7d93aaa172bb?w=1600&q=80";

  return (
    <div className="w-full px-4 pb-16 sm:px-6">
      {/* Hero banner */}
      <section
        className="relative flex min-h-[480px] w-full items-end overflow-hidden rounded-[2rem] p-6 shadow-xl sm:min-h-[520px] sm:p-8"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#e8f1fa]/95 via-[#e8f1fa]/45 to-transparent backdrop-blur-[2px]" />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col justify-end">
          <div className="max-w-3xl rounded-[1.5rem] border border-white/70 bg-glass p-6 shadow-[0_20px_40px_rgba(90,120,150,0.12)] sm:p-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-300/40 bg-sky-500/10 px-4 py-1.5 backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-sky-500 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                {course.category || "Course"} · {course.language}
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-[#1f2d3d] sm:text-5xl">
              {course.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
              {course.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-5 text-sm font-medium text-[var(--muted)]">
              <div className="flex items-center gap-2">
                <span className="text-sky-600">◷</span>
                {weeks} {weeks === 1 ? "Week" : "Weeks"} · {totalMin} min
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sky-600">▣</span>
                Level {course.level}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sky-600">✦</span>
                Certificate included
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sky-600">♪</span>
                Voice narration
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content + sticky enroll card */}
      <div className="relative mx-auto mt-10 flex w-full max-w-6xl flex-col gap-8 lg:mt-8 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-12">
          <section>
            <h2 className="mb-6 flex items-center gap-3 font-[family-name:var(--font-display)] text-2xl font-bold text-[#1f2d3d]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-sky-300/40 bg-sky-500/10 shadow-[0_0_12px_rgba(56,189,248,0.2)]">
                <span className="h-2 w-2 rounded-full bg-sky-500" />
              </span>
              Course overview
            </h2>
            <div className="space-y-4 text-[15px] leading-relaxed text-[var(--muted)]">
              <p>
                {course.description} Each lesson is written for clarity and paired with
                generated voice narration so you can read and listen at your pace.
              </p>
              <p>
                Complete every lesson to unlock your verifiable Lingora certificate. Progress
                is saved to your account, and you can revisit any lesson anytime after
                enrollment.
              </p>
            </div>
          </section>

          <section>
            <h2 className="mb-6 flex items-center gap-3 font-[family-name:var(--font-display)] text-2xl font-bold text-[#1f2d3d]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-sky-300/40 bg-sky-500/10 shadow-[0_0_12px_rgba(56,189,248,0.2)]">
                <span className="h-2 w-2 rounded-full bg-sky-500" />
              </span>
              Syllabus
            </h2>
            <SyllabusAccordion lessons={course.lessons} />
          </section>

          <section>
            <div className="relative flex flex-col items-start gap-6 overflow-hidden rounded-[1.5rem] border border-white/80 bg-glass p-6 shadow-[0_20px_40px_rgba(90,120,150,0.06)] sm:flex-row sm:items-center sm:p-8">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-300/20 blur-[50px]" />
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-white/50 bg-gradient-to-br from-[#8ad4ff] to-[#3aa8f0] text-3xl font-bold text-white shadow-lg">
                L
              </div>
              <div className="relative">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
                  What you get
                </span>
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#1f2d3d]">
                  Text · Voice · Certificate
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
                  Structured lessons with playable narration, progress tracking, and a
                  downloadable certificate you can verify online.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/60 bg-white/50 px-3 py-1 text-xs text-[#1f2d3d]">
                    {course.lessons.length} lessons
                  </span>
                  <span className="rounded-full border border-white/60 bg-white/50 px-3 py-1 text-xs text-[#1f2d3d]">
                    Level {course.level}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-[360px] lg:self-start lg:-mt-36 z-20">
          <div className="relative overflow-hidden rounded-[1.5rem] border border-white/80 bg-glass p-6 shadow-[0_30px_60px_rgba(90,120,150,0.14)] sm:p-7">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
            <div className="relative">
              <div className="mb-5 flex items-end justify-between gap-3">
                <span className="font-[family-name:var(--font-display)] text-4xl font-extrabold text-[#1f2d3d]">
                  {formatPrice(course.priceCents)}
                </span>
                <span className="mb-1 text-sm text-[var(--muted)] line-through">
                  {formatPrice(Math.round(course.priceCents * 1.4))}
                </span>
              </div>

              {user ? (
                <AddToCartButton courseId={course.id} enrolled={enrolled} />
              ) : (
                <Link
                  href={`/login?callbackUrl=/courses/${course.slug}`}
                  className="btn-glass-primary inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-bold uppercase tracking-wide"
                >
                  Log in to enroll
                  <span aria-hidden>→</span>
                </Link>
              )}

              <p className="mt-3 mb-6 text-center text-xs text-[var(--muted)]">
                Instant access after purchase · Certificate on completion
              </p>

              <ul className="space-y-3 text-sm text-[var(--muted)]">
                {[
                  "Full lifetime access",
                  "Text lessons with voice narration",
                  "Progress tracking",
                  "Certificate of completion",
                  "Public certificate verification",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 text-sky-600">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
