export const mouthVowelNames = ["aa", "ih", "ou", "ee", "oh"] as const;

export type MouthVowel = (typeof mouthVowelNames)[number];

export type MouthVowelWeights = Readonly<Record<MouthVowel, number>>;

export type MouthCapabilities = Readonly<Record<MouthVowel, boolean>>;

export interface MouthTarget {
  readonly scalar: number;
  readonly vowels?: MouthVowelWeights;
}

const attackRate = 0.55;
const releaseRate = 0.30;
const zeroThreshold = 0.001;

export function mapMouthTarget(
  target: MouthTarget,
  capabilities: MouthCapabilities,
): MouthVowelWeights {
  const mapped: Record<MouthVowel, number> = {
    aa: 0,
    ih: 0,
    ou: 0,
    ee: 0,
    oh: 0,
  };
  const source: MouthVowelWeights = target.vowels ?? {
    aa: target.scalar,
    ih: 0,
    ou: 0,
    ee: 0,
    oh: 0,
  };

  for (const vowel of mouthVowelNames) {
    const weight = boundedWeight(source[vowel]);
    if (capabilities[vowel]) {
      mapped[vowel] += weight;
    } else if (vowel !== "aa" && capabilities.aa) {
      mapped.aa += weight;
    }
  }

  mapped.aa = Math.min(1, mapped.aa);
  return freezeWeights(mapped);
}

export class MouthController {
  private current: MouthVowelWeights = zeroMouthVowelWeights();
  private readonly capabilities: MouthCapabilities;

  constructor(capabilities: MouthCapabilities) {
    this.capabilities = Object.freeze({ ...capabilities });
  }

  update(target: MouthTarget): MouthVowelWeights {
    const mapped = mapMouthTarget(target, this.capabilities);
    const next: Record<MouthVowel, number> = {
      aa: 0,
      ih: 0,
      ou: 0,
      ee: 0,
      oh: 0,
    };

    for (const vowel of mouthVowelNames) {
      const current = this.current[vowel];
      const desired = mapped[vowel];
      const rate = desired > current ? attackRate : releaseRate;
      const value = current + (desired - current) * rate;
      next[vowel] = value < zeroThreshold ? 0 : Math.min(1, value);
    }

    this.current = freezeWeights(next);
    return this.current;
  }

  clear(): MouthVowelWeights {
    this.current = zeroMouthVowelWeights();
    return this.current;
  }
}

export function zeroMouthVowelWeights(): MouthVowelWeights {
  return freezeWeights({
    aa: 0,
    ih: 0,
    ou: 0,
    ee: 0,
    oh: 0,
  });
}

function boundedWeight(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function freezeWeights(weights: Record<MouthVowel, number>): MouthVowelWeights {
  return Object.freeze(weights);
}
