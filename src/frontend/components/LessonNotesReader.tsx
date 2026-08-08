"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSpeech } from "@/frontend/hooks/useSpeech";
import { VoiceAvatar } from "@/frontend/components/VoiceAvatar";

function HighlightedText({
  text,
  charIndex,
  charLength,
  active,
}: {
  text: string;
  charIndex: number;
  charLength: number;
  active: boolean;
}) {
  const markRef = useRef<HTMLElement>(null);
  const end = active
    ? charLength > 0
      ? charIndex + charLength
      : (() => {
          const rest = text.slice(charIndex);
          const match = rest.match(/^\S+/);
          return charIndex + (match ? match[0].length : 0);
        })()
    : -1;

  useEffect(() => {
    if (active && markRef.current) {
      markRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }, [active, charIndex, charLength]);

  if (!active || charIndex < 0) {
    return <>{text}</>;
  }

  const before = text.slice(0, charIndex);
  const current = text.slice(charIndex, end);
  const after = text.slice(end);

  return (
    <>
      {before}
      <mark
        ref={markRef}
        className="rounded-sm bg-sky-300/70 px-0.5 text-[#0f2740] shadow-[0_0_0_2px_rgba(125,211,252,0.35)] transition-colors"
      >
        {current}
      </mark>
      {after}
    </>
  );
}

export function LessonNotesReader({
  text,
  title,
  language,
}: {
  text: string;
  title?: string;
  language?: string;
}) {
  const {
    status,
    rate,
    setRate,
    charIndex,
    charLength,
    personas,
    voiceURI,
    setVoiceURI,
    selectedPersona,
    play,
    pause,
    resume,
    stop,
  } = useSpeech(text, language);

  const [voiceOpen, setVoiceOpen] = useState(false);
  const highlighting = status === "playing" || status === "paused";

  const offsets = useMemo(() => {
    const result: { start: number; end: number; value: string }[] = [];
    let cursor = 0;
    for (const part of text.split(/(\n+)/)) {
      if (!part) continue;
      result.push({ start: cursor, end: cursor + part.length, value: part });
      cursor += part.length;
    }
    return result;
  }, [text]);

  if (status === "unsupported") {
    return (
      <div className="flex h-full min-h-0 flex-col rounded-2xl border border-white/70 bg-glass p-5 shadow-lg sm:p-6">
        <h3 className="mb-4 flex items-center gap-2 font-semibold text-[#1f2d3d]">
          <span className="h-2 w-2 rounded-full bg-sky-500" />
          Lesson notes
        </h3>
        <article className="flex-1 whitespace-pre-wrap text-sm leading-relaxed text-[var(--muted)]">
          {text}
        </article>
        <p className="mt-4 text-sm text-[var(--muted)]">
          Voice playback is not supported in this browser.
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-white/70 bg-glass shadow-lg">
      <div className="shrink-0 border-b border-white/30 px-5 py-4 sm:px-6">
        <h3 className="flex items-center gap-2 font-semibold text-[#1f2d3d]">
          <span className="h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
          Lesson notes
          {title ? (
            <span className="font-normal text-[var(--muted)]">· {title}</span>
          ) : null}
        </h3>
        {highlighting && (
          <p className="mt-1 text-xs text-sky-700">
            Highlight follows the voice as it reads
          </p>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 sm:px-6 [scrollbar-width:thin]">
        <article className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--muted)] sm:text-[15px]">
          {offsets.map((chunk, i) => {
            if (/^\n+$/.test(chunk.value)) {
              return <span key={i}>{chunk.value}</span>;
            }

            const localStart = Math.max(0, charIndex - chunk.start);
            const overlaps =
              highlighting &&
              charIndex < chunk.end &&
              (charLength > 0
                ? charIndex + charLength > chunk.start
                : charIndex >= chunk.start);

            if (!overlaps) {
              return <span key={i}>{chunk.value}</span>;
            }

            return (
              <span key={i}>
                <HighlightedText
                  text={chunk.value}
                  charIndex={localStart}
                  charLength={
                    charLength > 0
                      ? Math.min(charLength, chunk.end - charIndex)
                      : 0
                  }
                  active
                />
              </span>
            );
          })}
        </article>
      </div>

      <div className="shrink-0 border-t border-white/40 bg-white/55 px-4 py-3 backdrop-blur-md sm:px-5">
        {voiceOpen && personas.length > 0 && (
          <div className="mb-3 grid max-h-52 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3 [scrollbar-width:thin]">
            {personas.map((p) => {
              const active = p.voiceURI === voiceURI;
              return (
                <button
                  key={p.voiceURI}
                  type="button"
                  onClick={() => {
                    setVoiceURI(p.voiceURI);
                    setVoiceOpen(false);
                  }}
                  className={`flex items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition ${
                    active
                      ? "border-sky-400/50 bg-sky-500/10 shadow-sm"
                      : "border-white/60 bg-white/55 hover:bg-white/75"
                  }`}
                >
                  <VoiceAvatar src={p.avatarUrl} label={p.label} size={40} />
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-semibold text-[#1f2d3d]">
                      {p.label}
                    </span>
                    <span className="block truncate text-[10px] text-[var(--muted)]">
                      {p.tone}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          {status === "playing" ? (
            <button
              type="button"
              onClick={pause}
              className="btn-glass-primary rounded-full px-4 py-2 text-sm font-semibold"
            >
              Pause
            </button>
          ) : status === "paused" ? (
            <button
              type="button"
              onClick={resume}
              className="btn-glass-primary rounded-full px-4 py-2 text-sm font-semibold"
            >
              Resume
            </button>
          ) : (
            <button
              type="button"
              onClick={play}
              className="btn-glass-primary rounded-full px-4 py-2 text-sm font-semibold"
            >
              Play voice
            </button>
          )}
          <button
            type="button"
            onClick={stop}
            className="rounded-full border border-white/80 bg-glass px-4 py-2 text-sm font-semibold text-[var(--muted)] backdrop-blur-md transition hover:bg-white/50 hover:text-[#1f2d3d]"
          >
            Stop
          </button>

          <button
            type="button"
            onClick={() => setVoiceOpen((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-glass py-1 pl-1 pr-3 text-sm font-semibold text-[#1f2d3d] backdrop-blur-md transition hover:bg-white/50"
            title="Change voice"
          >
            {selectedPersona ? (
              <VoiceAvatar
                src={selectedPersona.avatarUrl}
                label={selectedPersona.label}
                size={28}
              />
            ) : (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-xs">
                ?
              </span>
            )}
            <span className="hidden sm:inline">
              {selectedPersona?.label ?? "Voice"}
            </span>
            <span className="text-[10px] text-[var(--muted)]">
              {voiceOpen ? "▲" : "▼"}
            </span>
          </button>

          <label className="ml-auto flex items-center gap-2 text-xs text-[var(--muted)]">
            Speed
            <input
              type="range"
              min={0.7}
              max={1.4}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-24 accent-sky-500"
            />
            <span className="w-8 font-medium text-[#1f2d3d]">
              {rate.toFixed(1)}x
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
