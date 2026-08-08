import { statSync } from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import { CourseCard } from "@/frontend/components/CourseCard";
import HowItWorks from "@/frontend/components/ui/how-it-works";
import { TestimonialsSection } from "@/frontend/components/TestimonialsSection";
import { getFeaturedCourses } from "@/backend/services/courses";

const heroVersion = Math.floor(
  statSync(path.join(process.cwd(), "public", "hero.png")).mtimeMs,
);

const stats = [
  { label: "Languages available", value: "3+", icon: "◎" },
  { label: "Voice-narrated lessons", value: "Text+", icon: "♪" },
  { label: "Verified certificates", value: "100%", icon: "✦" },
  { label: "Learn at your pace", value: "24/7", icon: "◉" },
];

const benefits = [
  { title: "Text lessons", pct: 95, desc: "Clear reading you can revisit" },
  { title: "Voice narration", pct: 92, desc: "Play, pause, adjust speed" },
  { title: "Progress tracking", pct: 88, desc: "Mark lessons complete" },
  { title: "Certificates", pct: 100, desc: "PDF with verify code" },
];

const stack = [
  "Text",
  "Voice",
  "Search",
  "Cart",
  "Stripe",
  "Tests",
  "PDF",
  "Verify",
  "Admin",
];

export default async function HomePage() {
  const featured = await getFeaturedCourses();

  return (
    <div className="-mt-[4.75rem] overflow-hidden">
      {/* Hero — full-bleed under floating navbar */}
      <section className="relative min-h-[100svh] w-full overflow-hidden">
        {/* Full-bleed hero image to all edges including top */}
        <div className="absolute inset-0">
          <Image
            src={`/hero.png?v=${heroVersion}`}
            alt="Lingora learner"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-[72%_center] sm:object-[68%_center] lg:object-right"
          />
          {/* Left fade where hero copy sits */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `
                linear-gradient(
                  90deg,
                  #e8f1fa 0%,
                  #e8f1fa 18%,
                  rgba(232, 241, 250, 0.92) 32%,
                  rgba(232, 241, 250, 0.55) 48%,
                  rgba(232, 241, 250, 0.15) 62%,
                  transparent 78%
                )
              `,
            }}
          />
          {/* Soft top + stronger bottom blend into page */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#e8f1fa]/35 to-transparent" />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-56 sm:h-72"
            style={{
              background: `
                linear-gradient(
                  to top,
                  #e8f1f9 0%,
                  #e8f1f9 12%,
                  rgba(232, 241, 249, 0.92) 28%,
                  rgba(232, 241, 249, 0.65) 48%,
                  rgba(232, 241, 249, 0.32) 68%,
                  rgba(232, 241, 249, 0.1) 84%,
                  transparent 100%
                )
              `,
            }}
          />
        </div>

        <div className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
        <span className="hero-star left-[38%] top-[28%]">✦</span>
        <span className="hero-star left-[46%] top-[52%]" style={{ animationDelay: "1.2s" }}>
          ✦
        </span>

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col px-4 pb-16 pt-28 sm:px-6 sm:pt-32">
          <div className="mb-6 flex justify-end sm:mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-glass px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#4db8ff] shadow-[0_0_8px_#4db8ff]" />
              Open for new learners
            </div>
          </div>

          <div className="relative my-auto max-w-xl pb-10 pt-2">
            <h1 className="animate-fade-up chrome-text font-[family-name:var(--font-display)] text-[clamp(3.4rem,9vw,6.75rem)] font-extrabold leading-[0.88] tracking-[-0.03em]">
              LINGORA
            </h1>

            <p className="animate-fade-up-delay mt-6 text-lg font-medium text-[#2a3b4d] sm:text-xl">
              Language courses with voice &amp; certificates
            </p>
            <p className="animate-fade-up-delay mt-3 max-w-md text-[15px] leading-relaxed text-[var(--muted)]">
              Study clear text lessons, listen with generated voice narration, and earn a
              verifiable certificate when you finish.
            </p>

            <div className="animate-fade-up-delay-2 mt-8 flex flex-wrap gap-3">
              <Link
                href="/courses"
                className="btn-glass-primary inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold uppercase tracking-wide"
              >
                Browse courses
                <span aria-hidden className="text-base">
                  ↓
                </span>
              </Link>
              <Link
                href="/language-tests"
                className="btn-glass-ghost inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold uppercase tracking-wide"
              >
                Language test
                <span aria-hidden>↓</span>
              </Link>
            </div>
          </div>

          <div className="hero-seal animate-float absolute bottom-8 right-4 z-20 flex h-[7.25rem] w-[7.25rem] items-center justify-center rounded-full sm:bottom-12 sm:right-8 sm:h-32 sm:w-32">
            <svg className="animate-spin-slow absolute inset-1" viewBox="0 0 100 100">
              <defs>
                <path
                  id="sealPath"
                  d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0"
                />
              </defs>
              <text fill="#3d5a73" fontSize="7.2" fontWeight="700" letterSpacing="2.5">
                <textPath href="#sealPath" xlinkHref="#sealPath">
                  LEARN · LISTEN · CERTIFY · FUTURE ·
                </textPath>
              </text>
            </svg>
            <span className="relative text-2xl text-sky-500 drop-shadow-[0_0_10px_rgba(77,184,255,0.9)]">
              ✦
            </span>
          </div>
        </div>
      </section>

      {/* Stats — floating glass bar like navbar */}
      <section className="relative z-20 -mt-6 px-4 sm:-mt-8 sm:px-6">
        <div className="glass-panel mx-auto flex max-w-6xl flex-col gap-4 rounded-[2rem] px-5 py-4 shadow-lg shadow-sky-900/5 sm:rounded-full sm:px-6 sm:py-3.5 lg:flex-row lg:items-center lg:justify-between lg:gap-2">
          <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-2 lg:gap-0">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-3 rounded-full border border-white/50 bg-white/35 px-3 py-2.5 backdrop-blur-sm sm:justify-center lg:justify-start lg:border-0 lg:bg-transparent lg:px-3 lg:py-1 lg:backdrop-blur-none"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8ad4ff]/80 to-[#3aa8f0]/80 text-sm text-white shadow-sm shadow-sky-400/30">
                  {s.icon}
                </span>
                <div className="min-w-0">
                  <p className="font-[family-name:var(--font-display)] text-base font-bold leading-tight text-[var(--foreground)]">
                    {s.value}
                  </p>
                  <p className="truncate text-[11px] text-[var(--muted)]">
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <blockquote className="border-t border-white/50 pt-3 text-center text-xs italic leading-snug text-[var(--muted)] sm:px-2 lg:max-w-[220px] lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0 lg:text-left">
            “Design is not just what it looks like — learning is how it works.”
          </blockquote>
        </div>
      </section>

      {/* How it works — pinned board layout */}
      <section className="relative">
        <HowItWorks />
      </section>

      {/* Featured courses — case-study style panel */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="rounded-[2rem] border border-white/80 bg-glass p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_40px_rgba(90,120,150,0.08)] sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-sky-300/70 bg-white/28 text-[10px] text-sky-600">
                ◆
              </span>
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a8b9c]">
                Featured courses
              </h2>
            </div>
            <Link
              href="/courses"
              aria-label="View all courses"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d5dee8] bg-white text-[#5a6b7c] shadow-sm transition hover:border-sky-300 hover:text-sky-700"
            >
              →
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />

      {/* About / what you receive */}
      <section id="about" className="relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="glass-panel rounded-[1.75rem] p-6">
            <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
              What you receive
            </h3>
            <ul className="mt-6 space-y-5">
              {benefits.map((b) => (
                <li key={b.title}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium">{b.title}</span>
                    <span className="text-[var(--muted)]">{b.pct}%</span>
                  </div>
                  <div className="skill-bar">
                    <span style={{ width: `${b.pct}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-[var(--muted)]">{b.desc}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel rounded-[1.75rem] p-6">
            <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
              Platform
            </h3>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {stack.map((item) => (
                <div
                  key={item}
                  className="glass-panel-strong flex aspect-square flex-col items-center justify-center rounded-2xl text-center"
                >
                  <span className="text-xs font-semibold text-sky-800">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel flex flex-col items-center justify-center rounded-[1.75rem] p-6 text-center">
            <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
              Our approach
            </h3>
            <div className="relative mt-8 flex h-48 w-48 items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-dashed border-sky-300/70" />
              <div className="absolute inset-6 rounded-full border border-sky-200/80" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8ad4ff] to-[#2f8fd6] text-3xl text-white shadow-lg shadow-sky-400/40">
                ◆
              </div>
              {[
                { label: "Clear text", pos: "left-0 top-2" },
                { label: "Voice", pos: "right-0 top-2" },
                { label: "Practice", pos: "left-0 bottom-2" },
                { label: "Certificate", pos: "right-0 bottom-2" },
              ].map((n) => (
                <span
                  key={n.label}
                  className={`absolute ${n.pos} rounded-full bg-white/28 px-2 py-1 text-[10px] font-semibold text-sky-800 backdrop-blur`}
                >
                  {n.label}
                </span>
              ))}
            </div>
            <p className="mt-6 text-sm text-[var(--muted)]">
              Human-centered learning with clean lessons and purposeful outcomes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
