"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

const keys = [
  { note: "C4", midi: 60, shortcut: "a", slot: 0 },
  { note: "C sharp 4", midi: 61, shortcut: "w", slot: 1, sharp: true },
  { note: "D4", midi: 62, shortcut: "s", slot: 1 },
  { note: "D sharp 4", midi: 63, shortcut: "e", slot: 2, sharp: true },
  { note: "E4", midi: 64, shortcut: "d", slot: 2 },
  { note: "F4", midi: 65, shortcut: "f", slot: 3 },
  { note: "F sharp 4", midi: 66, shortcut: "t", slot: 4, sharp: true },
  { note: "G4", midi: 67, shortcut: "g", slot: 4 },
  { note: "G sharp 4", midi: 68, shortcut: "y", slot: 5, sharp: true },
  { note: "A4", midi: 69, shortcut: "h", slot: 5 },
  { note: "A sharp 4", midi: 70, shortcut: "u", slot: 6, sharp: true },
  { note: "B4", midi: 71, shortcut: "j", slot: 6 },
  { note: "C5", midi: 72, shortcut: "k", slot: 7 },
];

/** Ode to Joy, Beethoven (public domain), as [midi, beats]. */
const TUNE: Array<[number, number]> = [
  [64, 1], [64, 1], [65, 1], [67, 1], [67, 1], [65, 1], [64, 1], [62, 1],
  [60, 1], [60, 1], [62, 1], [64, 1], [64, 1.5], [62, 0.5], [62, 2],
];
const BEAT_MS = 380;

/**
 * A small piano voice built from Web Audio parts: three slightly detuned
 * strings, a filter that starts bright and mellows as the note rings (the
 * way a struck string loses its top end), a short felt "knock" for the
 * hammer, and a little room reverb. Everything shares one bus and a gentle
 * compressor so chords do not clip.
 */
type Engine = {
  audio: AudioContext;
  bus: GainNode;
  noise: AudioBuffer;
  tone: PeriodicWave;
};

type Voice = { stop: (soft?: boolean) => void; midi: number };

function createEngine(): Engine {
  const audio = new AudioContext();
  const compressor = audio.createDynamicsCompressor();
  compressor.threshold.value = -18;
  compressor.ratio.value = 3;
  compressor.connect(audio.destination);

  const bus = audio.createGain();
  bus.gain.value = 0.9;
  bus.connect(compressor);

  // A short, dark room: decaying noise as an impulse response.
  const length = Math.floor(audio.sampleRate * 1.6);
  const impulse = audio.createBuffer(2, length, audio.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3;
    }
  }
  const reverb = audio.createConvolver();
  reverb.buffer = impulse;
  const wet = audio.createGain();
  wet.gain.value = 0.22;
  bus.connect(reverb).connect(wet).connect(compressor);

  const noise = audio.createBuffer(1, Math.floor(audio.sampleRate * 0.04), audio.sampleRate);
  const n = noise.getChannelData(0);
  for (let i = 0; i < n.length; i++) n[i] = (Math.random() * 2 - 1) * (1 - i / n.length);

  // Harmonics fall off quickly, with a slightly weak 7th like a real string.
  const real = new Float32Array(10);
  const imag = new Float32Array([0, 1, 0.55, 0.32, 0.2, 0.13, 0.08, 0.03, 0.04, 0.02]);
  const tone = audio.createPeriodicWave(real, imag);

  return { audio, bus, noise, tone };
}

function strike(engine: Engine, midi: number, held: boolean): Voice["stop"] {
  const { audio, bus, noise, tone } = engine;
  const time = audio.currentTime;
  const frequency = 440 * 2 ** ((midi - 69) / 12);
  // Higher notes ring shorter, as on a real piano.
  const ring = 3.4 - (midi - 60) * 0.11;

  const filter = audio.createBiquadFilter();
  filter.type = "lowpass";
  filter.Q.value = 0.6;
  filter.frequency.setValueAtTime(Math.min(frequency * 14, 12000), time);
  filter.frequency.exponentialRampToValueAtTime(frequency * 2.6, time + 1.2);

  const amp = audio.createGain();
  amp.gain.setValueAtTime(0.0001, time);
  amp.gain.exponentialRampToValueAtTime(0.22, time + 0.006);
  amp.gain.exponentialRampToValueAtTime(0.09, time + 0.35);
  amp.gain.exponentialRampToValueAtTime(0.0001, time + (held ? ring : 1.1));
  filter.connect(amp).connect(bus);

  const strings = [-3, 0, 3.5].map((cents) => {
    const oscillator = audio.createOscillator();
    oscillator.setPeriodicWave(tone);
    oscillator.frequency.value = frequency;
    oscillator.detune.value = cents;
    const level = audio.createGain();
    level.gain.value = cents === 0 ? 0.5 : 0.28;
    oscillator.connect(level).connect(filter);
    oscillator.start(time);
    oscillator.stop(time + (held ? ring : 1.1) + 0.05);
    return oscillator;
  });

  const hammer = audio.createBufferSource();
  hammer.buffer = noise;
  const knock = audio.createBiquadFilter();
  knock.type = "bandpass";
  knock.frequency.value = Math.min(frequency * 3, 4000);
  const knockLevel = audio.createGain();
  knockLevel.gain.value = 0.06;
  hammer.connect(knock).connect(knockLevel).connect(bus);
  hammer.start(time);

  strings[0].onended = () => {
    amp.disconnect();
    filter.disconnect();
  };

  return (soft = false) => {
    const now = audio.currentTime;
    const level = Math.max(amp.gain.value, 0.0001);
    amp.gain.cancelScheduledValues(now);
    amp.gain.setValueAtTime(level, now);
    // The damper falls: a quick fade, a little slower when the key is let go gently.
    amp.gain.setTargetAtTime(0.0001, now, soft ? 0.18 : 0.08);
    strings.forEach((oscillator) => {
      try {
        oscillator.stop(now + 0.6);
      } catch {
        // Already stopped.
      }
    });
  };
}

type Spark = { id: number; slot: number; sharp: boolean };

export function Piano() {
  const instructions = useId();
  const engine = useRef<Engine | null>(null);
  const voices = useRef(new Map<string, Voice>());
  const sparkId = useRef(0);
  const tuneTimers = useRef<number[]>([]);
  const [playing, setPlaying] = useState<number[]>([]);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [tunePlaying, setTunePlaying] = useState(false);
  const [soundError, setSoundError] = useState(false);

  const getEngine = useCallback(() => {
    if (!engine.current) engine.current = createEngine();
    const { audio } = engine.current;
    if (audio.state !== "running") {
      void audio.resume().then(() => setSoundError(false), () => setSoundError(true));
    }
    return engine.current;
  }, []);

  const sparkle = useCallback((midi: number) => {
    const key = keys.find((item) => item.midi === midi);
    if (!key) return;
    const id = ++sparkId.current;
    setSparks((current) => [...current.slice(-10), { id, slot: key.slot, sharp: !!key.sharp }]);
    window.setTimeout(() => setSparks((current) => current.filter((spark) => spark.id !== id)), 1300);
  }, []);

  const sync = () => setPlaying(Array.from(voices.current.values(), (voice) => voice.midi));

  function play(midi: number, input?: string) {
    if (input && voices.current.has(input)) return;
    try {
      const stop = strike(getEngine(), midi, Boolean(input));
      sparkle(midi);
      if (input) {
        voices.current.set(input, { stop, midi });
        sync();
      }
    } catch {
      setSoundError(true);
    }
  }

  function release(input: string) {
    const voice = voices.current.get(input);
    if (!voice) return;
    voices.current.delete(input);
    voice.stop(true);
    sync();
  }

  const stopTune = useCallback(() => {
    tuneTimers.current.forEach((timer) => window.clearTimeout(timer));
    tuneTimers.current = [];
    setTunePlaying(false);
  }, []);

  function playTune() {
    if (tunePlaying) {
      stopTune();
      return;
    }
    let engineNow: Engine;
    try {
      engineNow = getEngine();
    } catch {
      setSoundError(true);
      return;
    }
    setTunePlaying(true);
    let at = 0;
    TUNE.forEach(([midi, beats], index) => {
      const input = `tune:${index}`;
      tuneTimers.current.push(
        window.setTimeout(() => {
          const stop = strike(engineNow, midi, true);
          sparkle(midi);
          voices.current.set(input, { stop, midi });
          sync();
        }, at),
        window.setTimeout(() => {
          const voice = voices.current.get(input);
          if (voice) {
            voices.current.delete(input);
            voice.stop(true);
            sync();
          }
        }, at + beats * BEAT_MS * 0.92),
      );
      at += beats * BEAT_MS;
    });
    tuneTimers.current.push(window.setTimeout(() => setTunePlaying(false), at));
  }

  const releaseAll = useCallback(() => {
    voices.current.forEach((voice) => voice.stop());
    voices.current.clear();
    setPlaying([]);
  }, []);

  useEffect(() => {
    const activeVoices = voices.current;
    window.addEventListener("blur", releaseAll);
    return () => {
      window.removeEventListener("blur", releaseAll);
      stopTune();
      activeVoices.clear();
      const audio = engine.current?.audio;
      engine.current = null;
      if (audio) void audio.close().catch(() => {});
    };
  }, [releaseAll, stopTune]);

  return (
    <div className="rounded-2xl border border-[hsl(var(--stroke))] bg-[linear-gradient(180deg,#17191d,#0e0f12)] p-3 shadow-xl shadow-black/40 sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p id={instructions} className="text-xs leading-relaxed text-[hsl(var(--muted))]">
          Tap a key, or type the letters on it.
        </p>
        <button
          type="button"
          onClick={playTune}
          aria-pressed={tunePlaying}
          className="inline-flex min-h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-[hsl(var(--stroke))] px-3 text-xs font-semibold text-[hsl(var(--text))] transition-colors hover:border-[hsl(var(--signal))]/60 hover:text-[hsl(var(--signal))] aria-pressed:border-[hsl(var(--signal))]/60 aria-pressed:text-[hsl(var(--signal))]"
        >
          <span aria-hidden="true">{tunePlaying ? "■" : "♪"}</span>
          {tunePlaying ? "Stop" : "Play a tune"}
        </button>
      </div>

      <div className="relative">
        {/* Notes float up from whatever was just played. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-2 z-30 h-0">
          {sparks.map((spark) => (
            <span
              key={spark.id}
              className="pf-note-rise absolute -translate-x-1/2 text-lg text-[hsl(var(--signal))] drop-shadow-[0_0_8px_hsl(var(--signal)/0.8)]"
              style={{ left: `${spark.slot * 12.5 + (spark.sharp ? 0 : 6.25)}%` }}
            >
              ♪
            </span>
          ))}
        </div>

        {/* The red felt strip that sits behind the keys of a real piano. */}
        <div aria-hidden="true" className="h-1.5 rounded-t-sm bg-[linear-gradient(180deg,#8f1d25,#5c1016)]" />
        <div
          role="group"
          aria-label="Playable piano"
          aria-describedby={instructions}
          className="relative h-28 sm:h-32"
          onKeyDown={(event) => {
            if (event.altKey || event.ctrlKey || event.metaKey) return;
            const shortcut = event.key.toLowerCase();
            const key = keys.find((item) => item.shortcut === shortcut);
            if (!key) return;
            event.preventDefault();
            if (!event.repeat) play(key.midi, `key:${shortcut}`);
          }}
          onKeyUp={(event) => release(`key:${event.key.toLowerCase()}`)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) releaseAll();
          }}
        >
          {keys.map((key) => (
            <button
              key={key.midi}
              type="button"
              aria-label={key.note}
              aria-keyshortcuts={key.shortcut.toUpperCase()}
              data-playing={playing.includes(key.midi)}
              style={{ left: `${key.slot * 12.5}%` }}
              onPointerDown={(event) => {
                if (event.button !== 0) return;
                event.currentTarget.setPointerCapture(event.pointerId);
                play(key.midi, `pointer:${event.pointerId}`);
              }}
              onPointerUp={(event) => release(`pointer:${event.pointerId}`)}
              onLostPointerCapture={(event) => release(`pointer:${event.pointerId}`)}
              onClick={(event) => {
                if (event.detail === 0) play(key.midi);
              }}
              className={key.sharp
                ? "absolute top-0 z-20 flex h-[60%] w-[7.5%] min-w-6 -translate-x-1/2 touch-none cursor-pointer select-none items-end justify-center rounded-b-md border border-black bg-[linear-gradient(180deg,#1b1d21,#2c3036_85%,#3a3f46)] pb-2 text-[10px] font-semibold uppercase text-white/60 shadow-[0_4px_6px_rgba(0,0,0,0.6)] transition-[transform,background,box-shadow] duration-75 focus-visible:z-30 data-[playing=true]:translate-y-px data-[playing=true]:bg-[linear-gradient(180deg,#24456b,#3d6fa3)] data-[playing=true]:text-white data-[playing=true]:shadow-[0_0_18px_hsl(var(--signal)/0.7)]"
                : "absolute inset-y-0 flex w-[12.5%] touch-none cursor-pointer select-none items-end justify-center rounded-b-md border border-[#1a1b1e] bg-[linear-gradient(180deg,#f4f1ea,#e6e2d8_80%,#d6d1c5)] pb-2 text-[10px] font-semibold uppercase text-[#5b5f67] shadow-[inset_0_-4px_0_rgba(0,0,0,0.12)] transition-[transform,background,box-shadow] duration-75 hover:bg-[linear-gradient(180deg,#ffffff,#eeeae1)] focus-visible:z-10 data-[playing=true]:translate-y-px data-[playing=true]:bg-[linear-gradient(180deg,#d9e6f5,#a9c6e6)] data-[playing=true]:text-[#1f3d63] data-[playing=true]:shadow-[0_0_22px_hsl(var(--signal)/0.6),inset_0_-2px_0_rgba(0,0,0,0.15)]"}
            >
              <span aria-hidden="true">{key.shortcut}</span>
            </button>
          ))}
        </div>
      </div>
      {soundError ? <p role="status" className="mt-2 text-sm">Sound couldn’t start. Try pressing a key again.</p> : null}
    </div>
  );
}
