"use client";

import { useSpeech } from "@/frontend/hooks/useSpeech";

export function TtsPlayer({
  text,
  title,
  durationMin,
}: {
  text: string;
  title?: string;
  durationMin?: number;
}) {
  const { status, rate, setRate, play, pause, resume, stop } = useSpeech(text);

  if (status === "unsupported") {
    return (
      <div className="flex h-full min-h-[220px] items-center justify-center rounded-2xl border border-white/30 bg-[#1f2d3d]/80 p-6 text-sm text-white/70">
        Voice playback is not supported in this browser. You can still read the lesson notes below.
      </div>
    );
  }

  const playing = status === "playing";
  const paused = status === "paused";

  return (
    <div className="group relative flex h-full min-h-[240px] flex-col overflow-hidden rounded-2xl border border-white/25 bg-[#15202b]/85 shadow-2xl backdrop-blur-2xl sm:min-h-[280px]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(56,189,248,0.35), rgba(59,130,246,0.2)), url(https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200/80">
          Voice lesson
        </p>
        {title && (
          <h2 className="max-w-xl font-[family-name:var(--font-display)] text-xl font-bold text-white sm:text-2xl">
            {title}
          </h2>
        )}
        {durationMin != null && (
          <p className="mt-2 text-sm text-white/60">~{durationMin} min</p>
        )}

        <button
          type="button"
          onClick={() => {
            if (playing) pause();
            else if (paused) resume();
            else play();
          }}
          className="mt-8 flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white shadow-[0_0_40px_rgba(255,255,255,0.12)] backdrop-blur-xl transition hover:scale-105 hover:bg-white/25"
          aria-label={playing ? "Pause" : "Play"}
        >
          <span className="text-3xl">{playing ? "❚❚" : "▶"}</span>
        </button>

        {(playing || paused) && (
          <p className="mt-4 flex items-center gap-2 text-sm text-sky-200">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-400" />
            {playing ? "Playing narration" : "Paused"}
          </p>
        )}
      </div>

      <div className="relative z-10 border-t border-white/10 bg-black/35 px-4 py-3 backdrop-blur-md">
        <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-white/15">
          <div
            className={`h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all ${
              playing ? "w-2/3 animate-pulse" : paused ? "w-1/2" : "w-0"
            }`}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (playing) pause();
                else if (paused) resume();
                else play();
              }}
              className="rounded-full px-3 py-1.5 text-sm hover:bg-white/10"
            >
              {playing ? "Pause" : paused ? "Resume" : "Play"}
            </button>
            <button
              type="button"
              onClick={stop}
              className="rounded-full px-3 py-1.5 text-sm text-white/70 hover:bg-white/10 hover:text-white"
            >
              Stop
            </button>
          </div>
          <label className="flex items-center gap-2 text-xs text-white/70">
            Speed
            <input
              type="range"
              min={0.7}
              max={1.4}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-24 accent-sky-400"
            />
            <span className="w-8 text-white/90">{rate.toFixed(1)}x</span>
          </label>
        </div>
      </div>
    </div>
  );
}
