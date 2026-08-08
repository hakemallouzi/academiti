export type VoicePersona = {
  voiceURI: string;
  voiceName: string;
  lang: string;
  label: string;
  avatarUrl: string;
  tone: string;
};

const PERSONA_BANK = [
  { label: "Aria", seed: "Aria-soft-wave", tone: "Clear & calm" },
  { label: "Noah", seed: "Noah-forest-calm", tone: "Warm & steady" },
  { label: "Luna", seed: "Luna-night-glow", tone: "Soft & bright" },
  { label: "Kai", seed: "Kai-spark-focus", tone: "Crisp & focused" },
  { label: "Mira", seed: "Mira-bloom-soft", tone: "Gentle & clear" },
  { label: "Orion", seed: "Orion-deep-pace", tone: "Deep & paced" },
  { label: "Sage", seed: "Sage-leaf-even", tone: "Natural & even" },
  { label: "Vera", seed: "Vera-crystal-sharp", tone: "Sharp & precise" },
  { label: "Leo", seed: "Leo-sun-bright", tone: "Bright & lively" },
  { label: "Nova", seed: "Nova-star-light", tone: "Modern & light" },
  { label: "Atlas", seed: "Atlas-compass-ground", tone: "Grounded & clear" },
  { label: "Iris", seed: "Iris-prism-open", tone: "Friendly & open" },
] as const;

function hashName(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

function avatarUrl(seed: string) {
  const params = new URLSearchParams({
    seed,
    backgroundColor: "b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf",
    radius: "50",
  });
  return `https://api.dicebear.com/9.x/avataaars/svg?${params.toString()}`;
}

function guessPreferLocal(voices: SpeechSynthesisVoice[]) {
  return [...voices].sort((a, b) => {
    if (a.localService !== b.localService) return a.localService ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

/** Map browser voices to friendly named personas with human avatars. */
export function buildVoicePersonas(
  voices: SpeechSynthesisVoice[],
  preferredLang?: string,
): VoicePersona[] {
  const sorted = guessPreferLocal(voices);
  const preferred = preferredLang
    ? sorted.filter((v) =>
        v.lang.toLowerCase().startsWith(preferredLang.toLowerCase().slice(0, 2)),
      )
    : [];
  const pool = (preferred.length > 0 ? preferred : sorted).slice(0, 12);

  const usedLabels = new Set<string>();

  return pool.map((voice, index) => {
    const persona =
      PERSONA_BANK[(hashName(voice.voiceURI || voice.name) + index) % PERSONA_BANK.length];
    let label: string = persona.label;
    if (usedLabels.has(label)) {
      label = `${persona.label} ${index + 1}`;
    }
    usedLabels.add(label);

    const langShort = voice.lang.split("-")[0]?.toUpperCase() || "EN";

    return {
      voiceURI: voice.voiceURI,
      voiceName: voice.name,
      lang: voice.lang,
      label,
      avatarUrl: avatarUrl(`${persona.seed}-${label}`),
      tone: `${persona.tone} · ${langShort}`,
    };
  });
}

export const VOICE_STORAGE_KEY = "lingora-tts-voice-uri";
