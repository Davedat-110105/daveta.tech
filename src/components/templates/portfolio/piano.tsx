"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import { createEngine, keys, SONGS, strike, type Engine, type Song, type Voice } from "./piano-audio";
import { PianoLights, type LightsApi } from "./piano-lights";

export function Piano() {
  const instructions = useId();
  const engine = useRef<Engine | null>(null);
  const voices = useRef(new Map<string, Voice>());
  const lights = useRef<LightsApi | null>(null);
  const tapId = useRef(0);
  const tuneTimers = useRef<number[]>([]);
  const [playing, setPlaying] = useState<number[]>([]);
  const [songPlaying, setSongPlaying] = useState<string | null>(null);
  const [soundError, setSoundError] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const getEngine = useCallback(() => {
    if (!engine.current) engine.current = createEngine();
    const { audio } = engine.current;
    if (audio.state !== "running") {
      void audio.resume().then(() => setSoundError(false), () => setSoundError(true));
    }
    return engine.current;
  }, []);

  const sync = () => setPlaying(Array.from(voices.current.values(), (voice) => voice.midi));

  function play(midi: number, input?: string) {
    if (input && voices.current.has(input)) return;
    try {
      const stop = strike(getEngine(), midi, Boolean(input));
      if (input) {
        voices.current.set(input, { stop, midi });
        lights.current?.on(midi, input);
        sync();
      } else {
        // A tap with no hold (keyboard activation): a short burst of light.
        const id = `tap:${++tapId.current}`;
        lights.current?.on(midi, id);
        window.setTimeout(() => lights.current?.off(id), 160);
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
    lights.current?.off(input);
    sync();
  }

  const stopTune = useCallback(() => {
    tuneTimers.current.forEach((timer) => window.clearTimeout(timer));
    tuneTimers.current = [];
    voices.current.forEach((voice, input) => {
      if (!input.startsWith("tune:")) return;
      voice.stop(true);
      lights.current?.off(input);
      voices.current.delete(input);
    });
    setPlaying(Array.from(voices.current.values(), (voice) => voice.midi));
    setSongPlaying(null);
  }, []);

  function playSong(song: Song) {
    const wasThis = songPlaying === song.id;
    stopTune();
    if (wasThis) return;
    let engineNow: Engine;
    try {
      engineNow = getEngine();
    } catch {
      setSoundError(true);
      return;
    }
    setSongPlaying(song.id);
    let at = 0;
    song.notes.forEach(([midi, beats], index) => {
      if (midi < 0) {
        at += beats * song.beatMs;
        return;
      }
      const input = `tune:${index}`;
      tuneTimers.current.push(
        window.setTimeout(() => {
          const stop = strike(engineNow, midi, true);
          voices.current.set(input, { stop, midi });
          lights.current?.on(midi, input);
          sync();
        }, at),
        window.setTimeout(() => release(input), at + beats * song.beatMs * 0.92),
      );
      at += beats * song.beatMs;
    });
    tuneTimers.current.push(window.setTimeout(() => setSongPlaying(null), at));
  }

  const releaseAll = useCallback(() => {
    voices.current.forEach((voice, input) => {
      voice.stop();
      lights.current?.off(input);
    });
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
    <div className="overflow-hidden rounded-2xl border border-[hsl(var(--stroke))] bg-[linear-gradient(180deg,#07080b,#0e0f12)] shadow-xl shadow-black/40">
      <div className="px-3 pt-3 sm:px-4 sm:pt-4">
        <p id={instructions} className="text-xs leading-relaxed text-[hsl(var(--muted))]">
          Tap a key, type the letters on it, or let it play one of these.
        </p>
        <div role="group" aria-label="Play a song" className="mt-3 flex flex-wrap gap-2">
          {SONGS.map((song) => {
            const on = songPlaying === song.id;
            return (
              <button
                key={song.id}
                type="button"
                onClick={() => playSong(song)}
                aria-pressed={on}
                className="inline-flex min-h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-[hsl(var(--stroke))] px-3 text-xs font-semibold text-[hsl(var(--text))] transition-colors hover:border-[hsl(var(--signal))]/60 hover:text-[hsl(var(--signal))] aria-pressed:border-[hsl(var(--signal))]/70 aria-pressed:bg-[hsl(var(--signal))]/10 aria-pressed:text-[hsl(var(--signal))]"
              >
                <span aria-hidden="true">{on ? "■" : "♪"}</span>
                {song.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-3 pb-3 sm:px-4 sm:pb-4">
        {/* The stage the light rises into. */}
        <div className="h-40 sm:h-52">
          <PianoLights apiRef={lights} reduceMotion={reduceMotion} />
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
      {soundError ? <p role="status" className="px-4 pb-3 text-sm">Sound couldn’t start. Try pressing a key again.</p> : null}
    </div>
  );
}
