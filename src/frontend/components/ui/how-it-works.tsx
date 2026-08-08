"use client";

import React from "react";
import { LazyMotion, domAnimation, m } from "motion/react";

type ColorTheme = "sky" | "blue" | "cyan";

interface CardProps {
  number: string;
  title: string;
  description: string;
  points?: string[];
  colorTheme?: ColorTheme;
  className?: string;
  rotate?: string;
  colors?: {
    bg: string;
    text: string;
    border: string;
  };
}

const Pin = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M16 3a1 1 0 0 1 .117 1.993l-.117 .007v4.764l1.894 3.789a1 1 0 0 1 .1 .331l.006 .116v2a1 1 0 0 1 -.883 .993l-.117 .007h-4v4a1 1 0 0 1 -1.993 .117l-.007 -.117v-4h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-2a1 1 0 0 1 .06 -.34l.046 -.107l1.894 -3.791v-4.762a1 1 0 0 1 -.117 -1.993l.117 -.007h8z" />
  </svg>
);

const Card = ({
  number,
  title,
  description,
  points,
  colorTheme = "sky",
  className,
  rotate,
  colors: customColors,
}: CardProps) => {
  const defaultBgColors = {
    sky: "bg-sky-50/90",
    blue: "bg-blue-50/90",
    cyan: "bg-cyan-50/90",
  };
  const defaultTextColors = {
    sky: "text-sky-500",
    blue: "text-sky-600",
    cyan: "text-cyan-600",
  };
  const defaultBorderColors = {
    sky: "border-sky-100/80",
    blue: "border-blue-100/80",
    cyan: "border-cyan-100/80",
  };

  const bgColor = customColors?.bg || defaultBgColors[colorTheme];
  const textColor = customColors?.text || defaultTextColors[colorTheme];
  const borderColor = customColors?.border || defaultBorderColors[colorTheme];

  return (
    <div
      className={`relative w-full transition-transform duration-300 hover:z-30 hover:scale-[1.03] md:w-[220px] ${rotate ?? ""} ${className ?? ""}`}
    >
      <div className="rounded-[20px] border border-white/80 bg-white/55 p-1.5 shadow-[0_10px_28px_rgba(90,130,170,0.1)] backdrop-blur-xl">
        <Pin className={`mx-auto mb-3 h-6 w-6 ${textColor}`} />
        <div
          className={`${bgColor} relative flex h-full flex-col overflow-hidden rounded-[12px] border ${borderColor} p-3`}
        >
          <span
            className={`${textColor} mb-2.5 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight`}
          >
            {number}
          </span>
          <h3 className="mb-1.5 font-[family-name:var(--font-display)] text-lg font-semibold leading-tight text-[#1f2d3d]">
            {title}
          </h3>
          <p className="text-xs leading-snug tracking-tight text-[var(--muted)]">
            {description}
          </p>
          {points && points.length > 0 ? (
            <ul className="mt-3 space-y-1">
              {points.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-[#2a3b4d]"
                >
                  <span
                    className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-white/70 text-[8px] ${textColor}`}
                  >
                    ✓
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export interface Step {
  title: string;
  description: string;
  points?: string[];
  colorTheme?: ColorTheme;
  colors?: {
    bg: string;
    text: string;
    border: string;
  };
}

export interface StepPosition {
  className?: string;
  rotate?: string;
}

export interface HowItWorksProps {
  features?: Step[];
  className?: string;
  stepPositions?: StepPosition[];
  heading?: string;
  subheading?: string;
}

const DEFAULT_CARD_POSITIONS: StepPosition[] = [
  { className: "md:absolute md:left-[8%] md:top-0", rotate: "md:rotate-6" },
  {
    className: "md:absolute md:right-[8%] md:top-[56px]",
    rotate: "md:-rotate-6",
  },
  {
    className:
      "md:absolute md:left-1/2 md:top-[240px] md:-translate-x-1/2",
    rotate: "md:rotate-0",
  },
  {
    className: "md:absolute md:right-[6%] md:top-[360px]",
    rotate: "md:-rotate-6",
  },
  {
    className: "md:absolute md:left-[8%] md:top-[540px]",
    rotate: "md:rotate-6",
  },
];

const DEFAULT_FEATURES: Step[] = [
  {
    title: "Choose your course",
    description:
      "Pick the exact skill you want to build. No prerequisites, no waiting.",
    points: ["30+ business skills", "Open to everyone", "Real-world focus"],
    colorTheme: "sky",
  },
  {
    title: "Learn at your pace",
    description:
      "Short, focused chapters designed to fit around a busy schedule.",
    points: ["Self-paced", "Lifetime access", "A few hours each"],
    colorTheme: "blue",
  },
  {
    title: "Earn your certificate",
    description:
      "Complete your course and your certificate is issued instantly.",
    points: ["Instant certificate", "Yours to keep", "Stack toward a program"],
    colorTheme: "cyan",
  },
];

function sectionHeight(count: number) {
  if (count <= 1) return 280;
  if (count === 2) return 320;
  if (count === 3) return 480;
  if (count === 4) return 620;
  return 780;
}

export default function HowItWorks({
  features,
  className,
  stepPositions,
  heading = "How it works",
  subheading = "From course to certificate",
}: HowItWorksProps) {
  const data = features && features.length > 0 ? features : DEFAULT_FEATURES;
  const positions = stepPositions || DEFAULT_CARD_POSITIONS;
  const height = sectionHeight(data.length);

  return (
    <LazyMotion features={domAnimation}>
      <div className={`relative px-4 py-10 sm:px-6 md:py-14 ${className ?? ""}`}>
        {/* Soft ruled paper lines */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(90,140,190,0.55) 1px, transparent 1px)",
            backgroundSize: "100% 32px",
            marginTop: "4px",
          }}
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[var(--background)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[var(--background)] to-transparent" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mb-8 max-w-xl md:mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7a8b9c]">
              {heading}
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              {subheading}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted)]">
              Three simple steps to build a skill and prove it.
            </p>
          </div>

          <div
            className="relative mx-auto flex h-auto w-full max-w-[1000px] flex-col space-y-6 md:block md:h-[var(--md-height)] md:space-y-0"
            style={{ "--md-height": `${height}px` } as React.CSSProperties}
          >
            {data.length > 1 && (
              <svg
                className="pointer-events-none absolute top-0 left-0 z-0 hidden h-full w-full text-sky-300/70 md:block"
                viewBox={`0 0 1000 ${height}`}
                preserveAspectRatio="none"
                aria-hidden
              >
                {(() => {
                  // Card 1 left → card 2 right (long) → card 3 center (short)
                  const pathD = data.reduce((acc, _, index) => {
                    if (index >= data.length - 1) return acc;
                    if (index === 0)
                      return "M 200 105 C 420 95, 580 175, 800 175";
                    if (index === 1)
                      return `${acc} C 880 175, 700 250, 500 300`;
                    if (index === 2)
                      return `${acc} C 500 420, 720 470, 820 470`;
                    if (index === 3)
                      return `${acc} C 980 470, 560 560, 220 580`;
                    return acc;
                  }, "");
                  return (
                    <m.path
                      d={pathD}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="8 6"
                      fill="none"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      initial={{ strokeDashoffset: 0 }}
                      animate={{ strokeDashoffset: -140 }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  );
                })()}
              </svg>
            )}

            {data.map((step, index) => {
              const position = positions[index % positions.length];
              return (
                <Card
                  key={step.title}
                  number={`0${index + 1}`}
                  title={step.title}
                  description={step.description}
                  points={step.points}
                  colorTheme={step.colorTheme || "sky"}
                  colors={step.colors}
                  rotate={position.rotate}
                  className={position.className}
                />
              );
            })}
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
