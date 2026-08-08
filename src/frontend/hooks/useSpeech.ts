"use client";

import { useCallback, useEffect, useState } from "react";
import {
  buildVoicePersonas,
  VOICE_STORAGE_KEY,
  type VoicePersona,
} from "@/frontend/lib/voicePersonas";

type Status = "idle" | "playing" | "paused" | "unsupported";

function getInitialStatus(): Status {
  if (typeof window === "undefined") return "idle";
  return window.speechSynthesis ? "idle" : "unsupported";
}

export function useSpeech(text: string, preferredLang?: string) {
  const [status, setStatus] = useState<Status>(getInitialStatus);
  const [rate, setRate] = useState(1);
  const [charIndex, setCharIndex] = useState(0);
  const [charLength, setCharLength] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [personas, setPersonas] = useState<VoicePersona[]>([]);
  const [voiceURI, setVoiceURIState] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    const load = () => {
      const list = window.speechSynthesis.getVoices();
      setVoices(list);
      const next = buildVoicePersonas(list, preferredLang);
      setPersonas(next);

      const saved =
        typeof localStorage !== "undefined"
          ? localStorage.getItem(VOICE_STORAGE_KEY)
          : null;
      const stillValid = next.some((p) => p.voiceURI === saved);
      if (saved && stillValid) {
        setVoiceURIState(saved);
      } else if (next[0]) {
        setVoiceURIState(next[0].voiceURI);
      }
    };

    load();
    window.speechSynthesis.addEventListener("voiceschanged", load);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", load);
      window.speechSynthesis.cancel();
    };
  }, [preferredLang]);

  useEffect(() => {
    window.speechSynthesis?.cancel();
    const frame = requestAnimationFrame(() => {
      setStatus((s) => (s === "unsupported" ? s : "idle"));
      setCharIndex(0);
      setCharLength(0);
    });
    return () => cancelAnimationFrame(frame);
  }, [text]);

  const setVoiceURI = useCallback((uri: string) => {
    setVoiceURIState(uri);
    try {
      localStorage.setItem(VOICE_STORAGE_KEY, uri);
    } catch {
      /* ignore */
    }
    window.speechSynthesis?.cancel();
    setStatus((s) => (s === "unsupported" ? s : "idle"));
    setCharIndex(0);
    setCharLength(0);
  }, []);

  const play = useCallback(() => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = rate;

    const selected =
      voices.find((v) => v.voiceURI === voiceURI) ||
      voices.find((v) => v.name === voiceURI);
    if (selected) utter.voice = selected;

    utter.onboundary = (event) => {
      if (event.name === "word" || event.name === "sentence") {
        setCharIndex(event.charIndex);
        setCharLength(event.charLength || 0);
      }
    };

    utter.onend = () => {
      setStatus("idle");
      setCharIndex(0);
      setCharLength(0);
    };
    utter.onerror = () => {
      setStatus("idle");
      setCharIndex(0);
      setCharLength(0);
    };

    setCharIndex(0);
    setCharLength(0);
    setStatus("playing");
    window.speechSynthesis.speak(utter);
  }, [text, rate, voiceURI, voices]);

  const pause = useCallback(() => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.pause();
    setStatus("paused");
  }, []);

  const resume = useCallback(() => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.resume();
    setStatus("playing");
  }, []);

  const stop = useCallback(() => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setStatus("idle");
    setCharIndex(0);
    setCharLength(0);
  }, []);

  const selectedPersona =
    personas.find((p) => p.voiceURI === voiceURI) || personas[0] || null;

  return {
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
  };
}
