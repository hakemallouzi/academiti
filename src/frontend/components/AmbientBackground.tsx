"use client";

/**
 * Soft animated ambient backdrop — orbs, mesh fades, light grain.
 * Sits behind page content (pointer-events none, fixed).
 */
export function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Base wash */}
      <div className="absolute inset-0 bg-atmosphere" />

      {/* Soft mesh grid fade */}
      <div className="absolute inset-0 opacity-[0.28] [background-image:linear-gradient(rgba(160,190,220,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(160,190,220,0.35)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />

      {/* Animated glow orbs */}
      <div className="ambient-orb ambient-orb-a" />
      <div className="ambient-orb ambient-orb-b" />
      <div className="ambient-orb ambient-orb-c" />
      <div className="ambient-orb ambient-orb-d" />

      {/* Small dotted field */}
      <div className="ambient-dots" />
      <div className="ambient-dots-soft" />

      {/* Edge vignette / fades */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(190,215,235,0.4)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#d5e6f4]/55 to-transparent" />
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#e4eef7]/55 to-transparent sm:w-40" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#dde9f4]/55 to-transparent sm:w-40" />

      {/* Fine grain */}
      <div className="absolute inset-0 opacity-[0.045] mix-blend-overlay [background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />
    </div>
  );
}
