/**
 * The piano's sound engine and key map, shared by the 3D stage and the flat
 * fallback keyboard.
 */

export const keys = [
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

/**
 * Songs the keyboard can play by itself. Public domain melodies only, each
 * fitted to the one octave the keyboard has (C4 to C5). Notes are
 * [midi, beats]; a midi of -1 is a rest.
 */
export type Song = { id: string; name: string; beatMs: number; notes: Array<[number, number]> };

export const SONGS: Song[] = [
  {
    id: "ode",
    name: "Ode to Joy",
    beatMs: 380,
    notes: [
      [64, 1], [64, 1], [65, 1], [67, 1], [67, 1], [65, 1], [64, 1], [62, 1],
      [60, 1], [60, 1], [62, 1], [64, 1], [64, 1.5], [62, 0.5], [62, 2],
    ],
  },
  {
    // The opening of Für Elise, moved down a major third to fit the octave.
    id: "elise",
    name: "Für Elise",
    beatMs: 170,
    notes: [
      [72, 1], [71, 1], [72, 1], [71, 1], [72, 1], [67, 1], [70, 1], [68, 1], [65, 2], [-1, 1],
      [60, 1], [65, 1], [67, 2], [-1, 1],
      [60, 1], [64, 1], [67, 1], [68, 2], [-1, 1], [60, 1],
      [72, 1], [71, 1], [72, 1], [71, 1], [72, 1], [67, 1], [70, 1], [68, 1], [65, 4],
    ],
  },
  {
    id: "twinkle",
    name: "Twinkle Twinkle",
    beatMs: 330,
    notes: [
      [60, 1], [60, 1], [67, 1], [67, 1], [69, 1], [69, 1], [67, 2],
      [65, 1], [65, 1], [64, 1], [64, 1], [62, 1], [62, 1], [60, 2],
      [67, 1], [67, 1], [65, 1], [65, 1], [64, 1], [64, 1], [62, 2],
      [67, 1], [67, 1], [65, 1], [65, 1], [64, 1], [64, 1], [62, 2],
      [60, 1], [60, 1], [67, 1], [67, 1], [69, 1], [69, 1], [67, 2],
      [65, 1], [65, 1], [64, 1], [64, 1], [62, 1], [62, 1], [60, 2],
    ],
  },
  {
    id: "jingle",
    name: "Jingle Bells",
    beatMs: 260,
    notes: [
      [64, 1], [64, 1], [64, 2], [64, 1], [64, 1], [64, 2],
      [64, 1], [67, 1], [60, 1.5], [62, 0.5], [64, 4],
      [65, 1], [65, 1], [65, 1.5], [65, 0.5], [65, 1], [64, 1], [64, 1], [64, 0.5], [64, 0.5],
      [64, 1], [62, 1], [62, 1], [64, 1], [62, 2], [67, 2],
    ],
  },
  {
    // Happy Birthday in F, which sits exactly in the octave.
    id: "birthday",
    name: "Happy Birthday",
    beatMs: 400,
    notes: [
      [60, 0.75], [60, 0.25], [62, 1], [60, 1], [65, 1], [64, 2],
      [60, 0.75], [60, 0.25], [62, 1], [60, 1], [67, 1], [65, 2],
      [60, 0.75], [60, 0.25], [72, 1], [69, 1], [65, 1], [64, 1], [62, 2],
      [70, 0.75], [70, 0.25], [69, 1], [65, 1], [67, 1], [65, 2],
    ],
  },
];

/**
 * A small piano voice built from Web Audio parts: three slightly detuned
 * strings, a filter that starts bright and mellows as the note rings (the
 * way a struck string loses its top end), a short felt "knock" for the
 * hammer, and a little room reverb. Everything shares one bus and a gentle
 * compressor so chords do not clip.
 */
export type Engine = {
  audio: AudioContext;
  bus: GainNode;
  noise: AudioBuffer;
  tone: PeriodicWave;
};

export type Voice = { stop: (soft?: boolean) => void; midi: number };

export function createEngine(): Engine {
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

export function strike(engine: Engine, midi: number, held: boolean): Voice["stop"] {
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
