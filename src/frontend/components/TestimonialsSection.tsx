"use client";

const testimonials = [
  {
    name: "Ava Green",
    username: "@ava",
    countryCode: "AU",
    countryName: "Australia",
    body: "Voice narration made French stick.",
    initial: "A",
  },
  {
    name: "Ana Miller",
    username: "@ana",
    countryCode: "DE",
    countryName: "Germany",
    body: "Clear text lessons I revisit anytime.",
    initial: "A",
  },
  {
    name: "Mateo Rossi",
    username: "@mat",
    countryCode: "IT",
    countryName: "Italy",
    body: "Certificate issued the moment I finished.",
    initial: "M",
  },
  {
    name: "Maya Patel",
    username: "@maya",
    countryCode: "IN",
    countryName: "India",
    body: "Setup was a breeze — started same day.",
    initial: "M",
  },
  {
    name: "Noah Smith",
    username: "@noah",
    countryCode: "US",
    countryName: "USA",
    body: "Best paced language courses I’ve tried.",
    initial: "N",
  },
  {
    name: "Lucas Stone",
    username: "@luc",
    countryCode: "FR",
    countryName: "France",
    body: "Speed control fits my busy weeks.",
    initial: "L",
  },
  {
    name: "Haruto Sato",
    username: "@haru",
    countryCode: "JP",
    countryName: "Japan",
    body: "Smooth on mobile — learn on the train.",
    initial: "H",
  },
  {
    name: "Emma Lee",
    username: "@emma",
    countryCode: "CA",
    countryName: "Canada",
    body: "Verify code on my cert felt pro.",
    initial: "E",
  },
  {
    name: "Carlos Ray",
    username: "@carl",
    countryCode: "ES",
    countryName: "Spain",
    body: "Great mix of reading and listening.",
    initial: "C",
  },
  {
    name: "Sofia Berg",
    username: "@sofia",
    countryCode: "SE",
    countryName: "Sweden",
    body: "Progress tracking kept me consistent.",
    initial: "S",
  },
  {
    name: "Kenji Mori",
    username: "@kenji",
    countryCode: "JP",
    countryName: "Japan",
    body: "Lessons are short enough for lunch breaks.",
    initial: "K",
  },
  {
    name: "Leila Haddad",
    username: "@leila",
    countryCode: "MA",
    countryName: "Morocco",
    body: "Voice + text together helped my accent.",
    initial: "L",
  },
  {
    name: "Owen Blake",
    username: "@owen",
    countryCode: "UK",
    countryName: "UK",
    body: "Bought one course — finished with a cert.",
    initial: "O",
  },
  {
    name: "Priya Shah",
    username: "@priya",
    countryCode: "IN",
    countryName: "India",
    body: "Clean UI. I actually enjoy studying here.",
    initial: "P",
  },
];

type Review = (typeof testimonials)[number];

function TestimonialCard({
  name,
  username,
  countryCode,
  countryName,
  body,
  initial,
}: Review) {
  return (
    <article className="w-[190px] shrink-0 rounded-2xl border border-white/85 bg-white/80 p-3.5 shadow-[0_12px_32px_rgba(70,110,150,0.12)] backdrop-blur-md sm:w-[210px]">
      <div className="flex items-start gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#8ad4ff] to-[#3aa8f0] text-xs font-bold text-white shadow-sm shadow-sky-400/30">
          {initial}
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="truncate text-sm font-semibold leading-none text-[#1f2d3d]">
            {name}
          </p>
          <p className="mt-1 truncate text-xs text-[var(--muted)]">{username}</p>
        </div>
        <div className="shrink-0 pt-0.5 text-right">
          <p className="text-sm font-semibold leading-none text-[#1f2d3d]">
            {countryCode}
          </p>
          <p className="mt-1 text-[11px] leading-none text-[var(--muted)]">
            {countryName}
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm leading-snug text-[#2a3b4d]">{body}</p>
    </article>
  );
}

function VerticalSlider({
  items,
  reverse = false,
  duration = "34s",
}: {
  items: Review[];
  reverse?: boolean;
  duration?: string;
}) {
  const loop = [...items, ...items];

  return (
    <div className="group relative h-[440px] w-[210px] overflow-hidden sm:h-[500px] sm:w-[230px]">
      <div
        className={`flex w-full flex-col gap-6 ${
          reverse ? "animate-testimonial-up" : "animate-testimonial-down"
        } group-hover:[animation-play-state:paused]`}
        style={{ animationDuration: duration }}
      >
        {loop.map((t, i) => (
          <TestimonialCard key={`${t.username}-${i}`} {...t} />
        ))}
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const columns = [
    { items: testimonials.slice(0, 3), reverse: false, duration: "34s" },
    { items: testimonials.slice(3, 6), reverse: true, duration: "38s" },
    { items: testimonials.slice(6, 9), reverse: false, duration: "36s" },
    { items: testimonials.slice(9, 12), reverse: true, duration: "40s" },
    { items: testimonials.slice(12, 15), reverse: false, duration: "35s" },
  ];

  return (
    <section className="relative z-0 pb-10 pt-14 sm:pb-12">
      <div className="mx-auto mb-10 max-w-6xl px-4 text-center sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a8b9c]">
          Testimonials
        </p>
        <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
          Learners love Lingora
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-[var(--muted)]">
          Real stories from people studying with voice, text, and certificates.
        </p>
      </div>

      <div
        className="relative mx-auto h-[520px] w-full max-w-7xl overflow-hidden sm:h-[580px]"
        style={{ perspective: "1100px" }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <div
            className="flex items-start gap-5 sm:gap-6"
            style={{
              transform:
                "rotateX(12deg) rotateY(-14deg) rotateZ(7deg) scale(0.82)",
              transformStyle: "preserve-3d",
            }}
          >
            {columns.map((col, colIdx) => (
              <div
                key={colIdx}
                style={{ transform: `translateY(${colIdx * 14}px)` }}
              >
                <VerticalSlider
                  items={col.items}
                  reverse={col.reverse}
                  duration={col.duration}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
