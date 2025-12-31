const MAP: Record<string, string> = {
  a: "C",
  e: "C",
  i: "C",
  o: "C",
  u: "C",
  b: "B",
  m: "B",
  p: "B",
  f: "F",
  v: "F",
  t: "D",
  d: "D",
  s: "D",
  z: "D",
  k: "G",
  g: "G",
  l: "E",
  r: "E",
  n: "E",
  h: "E",
};

type MouthCueValue = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "X";

export interface MouthCue {
  start: number;
  end: number;
  value: MouthCueValue;
}

interface WhisperSegment {
  text: string;
  offsets: {
    from: number;
    to: number;
  };
}

interface WhisperJson {
  transcription: WhisperSegment[];
}

export function whisperToMouthCues(json: WhisperJson): {
  metadata: Record<string, never>;
  mouthCues: MouthCue[];
} {
  const mouthCues: MouthCue[] = [];

  for (const seg of json.transcription) {
    const words: string[] = seg.text.trim().split(/\s+/);
    const duration = (seg.offsets.to - seg.offsets.from) / 1000;
    const step = duration / words.length;

    words.forEach((word: string, i: number) => {
      const ch = word[0]?.toLowerCase();

      mouthCues.push({
        start: +(seg.offsets.from / 1000 + i * step).toFixed(2),
        end: +(seg.offsets.from / 1000 + (i + 1) * step).toFixed(2),
        value: (MAP[ch] ?? "X") as MouthCueValue,
      });
    });
  }

  return {
    metadata: {},
    mouthCues,
  };
}
