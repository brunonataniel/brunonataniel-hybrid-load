export type UnitSystem = 'lbs' | 'kg';

export type FatigueType = 'combat' | 'stairs' | 'hiit' | 'swim' | 'running';

export type LiftType = 'squat' | 'bench' | 'deadlift' | 'overhead';

export type FatigueState = 'fresh' | 'standard' | 'endurance';

export type ExerciseCategory = 'lower' | 'upper';

export type CNSProfile = 'high' | 'low';

const BAR_WEIGHT_LBS = 45;
const BAR_WEIGHT_KG = 20;

const PLATE_WEIGHTS_LBS = [45, 25, 10, 5, 2.5] as const;
const PLATE_WEIGHTS_KG = [25, 20, 15, 10, 5, 2.5, 1.25] as const;

export type PlateWeight = number;

export interface PlateBreakdown {
  weight: PlateWeight;
  count: number;
}

export interface FatigueBreakdownItem {
  type: FatigueType;
  label: string;
  role: 'anchor' | 'modifier';
  value: number;
}

export interface CalculationResult {
  targetWeight: number;
  adjustedWeight: number;
  finalWeight: number;
  weightPerSide: number;
  plates: PlateBreakdown[];
  fatigueReduction: number;
  barWeight: number;
  breakdown: FatigueBreakdownItem[];
  volumeMultiplier: number;
  totalPenalty: number;
}

export function getExerciseCategory(lift: LiftType): ExerciseCategory {
  return (lift === 'squat' || lift === 'deadlift') ? 'lower' : 'upper';
}

const BASE_VALUES: Record<ExerciseCategory, Record<FatigueType, number>> = {
  lower: { combat: 15, running: 10, hiit: 10, swim: 5, stairs: 5 },
  upper: { combat: 15, hiit: 10, swim: 10, running: 3, stairs: 3 },
};

const CNS_PROFILE: Record<FatigueType, CNSProfile> = {
  combat: 'high',
  hiit: 'high',
  running: 'low',
  swim: 'low',
  stairs: 'low',
};

const MODIFIER_VALUES: Record<FatigueType, number> = {
  combat: 4,
  hiit: 3,
  running: 2,
  swim: 1,
  stairs: 1,
};

const FATIGUE_LABELS: Record<FatigueType, string> = {
  combat: 'Combat',
  hiit: 'HIIT',
  running: 'Run',
  swim: 'Swim',
  stairs: 'Stairs',
};

export function getBaseValue(type: FatigueType, lift: LiftType): number {
  const category = getExerciseCategory(lift);
  return BASE_VALUES[category][type];
}

function findAnchor(selectedTags: FatigueType[], lift: LiftType): FatigueType | null {
  if (selectedTags.length === 0) return null;
  const category = getExerciseCategory(lift);
  return selectedTags.reduce((best, tag) =>
    BASE_VALUES[category][tag] > BASE_VALUES[category][best] ? tag : best
  );
}

function getEffectiveModifier(tag: FatigueType, anchorCNS: CNSProfile): number {
  const base = MODIFIER_VALUES[tag];
  return anchorCNS === 'low' ? base + 1 : base;
}

export function computeBreakdown(activeFatigues: FatigueType[], lift: LiftType = 'squat'): {
  breakdown: FatigueBreakdownItem[];
  volumeMultiplier: number;
  totalPenalty: number;
  anchor: FatigueType | null;
} {
  if (activeFatigues.length === 0) {
    return { breakdown: [], volumeMultiplier: 0, totalPenalty: 0, anchor: null };
  }

  const anchor = findAnchor(activeFatigues, lift)!;
  const category = getExerciseCategory(lift);
  const anchorBase = BASE_VALUES[category][anchor];
  const anchorCNS = CNS_PROFILE[anchor];

  const breakdown: FatigueBreakdownItem[] = [];
  breakdown.push({
    type: anchor,
    label: FATIGUE_LABELS[anchor],
    role: 'anchor',
    value: anchorBase,
  });

  let modTotal = 0;
  const modifiers = activeFatigues.filter(t => t !== anchor);
  for (const mod of modifiers) {
    const val = getEffectiveModifier(mod, anchorCNS);
    modTotal += val;
    breakdown.push({
      type: mod,
      label: FATIGUE_LABELS[mod],
      role: 'modifier',
      value: val,
    });
  }

  const volumeMultiplier = Math.max(0, activeFatigues.length - 3);
  const totalPenalty = anchorBase + modTotal + volumeMultiplier;

  console.log(`[SystemicEngine] Anchor: ${anchor} (-${anchorBase}%), Modifiers: ${modifiers.map(m => `${m}(-${getEffectiveModifier(m, anchorCNS)}%)`).join(', ')}, Volume: -${volumeMultiplier}%, Total: -${totalPenalty}%`);

  return { breakdown, volumeMultiplier, totalPenalty, anchor };
}

export function computeTotalReduction(activeFatigues: FatigueType[], lift: LiftType = 'squat'): number {
  const { totalPenalty } = computeBreakdown(activeFatigues, lift);
  return totalPenalty / 100;
}

export function getFatigueReductionPercent(activeFatigues: FatigueType[], lift: LiftType = 'squat'): number {
  const { totalPenalty } = computeBreakdown(activeFatigues, lift);
  return totalPenalty;
}

export function getMarginalFatiguePercent(
  fatigueType: FatigueType,
  lift: LiftType,
  activeFatigues: FatigueType[],
): { percent: number; isAdjusted: boolean } {
  const category = getExerciseCategory(lift);
  const baseValue = BASE_VALUES[category][fatigueType];

  if (activeFatigues.length === 0) {
    return { percent: baseValue, isAdjusted: false };
  }

  const anchor = findAnchor(activeFatigues, lift)!;
  const anchorCNS = CNS_PROFILE[anchor];
  const isActive = activeFatigues.includes(fatigueType);

  if (isActive) {
    if (fatigueType === anchor) {
      return { percent: BASE_VALUES[category][anchor], isAdjusted: false };
    }
    const mod = getEffectiveModifier(fatigueType, anchorCNS);
    console.log(`[MarginalPreview] Active non-anchor ${fatigueType}: -${mod}% ADJ (anchor=${anchor}, CNS=${anchorCNS})`);
    return { percent: mod, isAdjusted: true };
  }

  const mod = getEffectiveModifier(fatigueType, anchorCNS);
  console.log(`[MarginalPreview] Inactive ${fatigueType}: -${mod}% ADJ (anchor=${anchor}, CNS=${anchorCNS})`);
  return { percent: mod, isAdjusted: true };
}

function roundToHalf(value: number): number {
  return Math.round(value * 2) / 2;
}

export function getBarWeight(unit: UnitSystem): number {
  return unit === 'lbs' ? BAR_WEIGHT_LBS : BAR_WEIGHT_KG;
}

export function getPlateWeights(unit: UnitSystem): readonly number[] {
  return unit === 'lbs' ? PLATE_WEIGHTS_LBS : PLATE_WEIGHTS_KG;
}

export function calculatePlates(
  oneRepMax: number,
  targetPercent: number,
  activeFatigues: FatigueType[],
  unit: UnitSystem = 'lbs',
  lift: LiftType = 'squat'
): CalculationResult {
  const { breakdown, volumeMultiplier, totalPenalty } = computeBreakdown(activeFatigues, lift);

  const targetWeight = (oneRepMax * targetPercent) / 100;
  const adjustedWeight = targetWeight * (1 - totalPenalty / 100);
  const finalWeight = roundToHalf(adjustedWeight);
  const barWeight = getBarWeight(unit);
  const clampedFinal = Math.max(barWeight, finalWeight);
  const weightPerSide = Math.max(0, (clampedFinal - barWeight) / 2);

  const plates: PlateBreakdown[] = [];
  let remaining = weightPerSide;
  const plateWeights = getPlateWeights(unit);

  for (const plateWeight of plateWeights) {
    const count = Math.floor(remaining / plateWeight);
    if (count > 0) {
      plates.push({ weight: plateWeight, count });
      remaining -= count * plateWeight;
    }
  }

  console.log(`[SystemicEngine] ${oneRepMax}${unit} × ${targetPercent}% × (1 - ${totalPenalty}%) = ${clampedFinal}${unit}`);

  return {
    targetWeight: Math.round(targetWeight * 10) / 10,
    adjustedWeight: Math.round(adjustedWeight * 10) / 10,
    finalWeight: clampedFinal,
    weightPerSide,
    plates,
    fatigueReduction: totalPenalty > 0 ? -totalPenalty : 0,
    barWeight,
    breakdown,
    volumeMultiplier,
    totalPenalty,
  };
}

const PLATE_COLORS_LBS: Record<number, string> = {
  45: '#C0392B',
  25: '#2980B9',
  10: '#27AE60',
  5: '#F39C12',
  2.5: '#8E44AD',
};

const PLATE_COLORS_KG: Record<number, string> = {
  25: '#C0392B',
  20: '#2980B9',
  15: '#F1C40F',
  10: '#27AE60',
  5: '#E8E8E8',
  2.5: '#F39C12',
  1.25: '#8E44AD',
};

export function getPlateColor(weight: PlateWeight, unit: UnitSystem = 'lbs'): string {
  const map = unit === 'lbs' ? PLATE_COLORS_LBS : PLATE_COLORS_KG;
  return map[weight] ?? '#636366';
}

export function convertWeight(value: number, from: UnitSystem, to: UnitSystem): number {
  if (from === to) return value;
  if (to === 'lbs') {
    return Math.round(value * 2.20462 * 10) / 10;
  }
  return Math.round((value / 2.20462) * 10) / 10;
}

export function getPlateLabel(weight: PlateWeight): string {
  return weight % 1 === 0 ? String(weight) : weight.toFixed(weight === 1.25 ? 2 : 1);
}

export const FATIGUE_OPTIONS: { type: FatigueType; label: string; reduction: string }[] = [
  { type: 'combat', label: 'Combat', reduction: '15%' },
  { type: 'hiit', label: 'HIIT', reduction: '10%' },
  { type: 'running', label: 'Run', reduction: '10%' },
  { type: 'swim', label: 'Swim', reduction: '5%' },
  { type: 'stairs', label: 'Stairs', reduction: '5%' },
];

export function getScaledFatiguePercent(fatigueType: FatigueType, lift: LiftType): number {
  const category = getExerciseCategory(lift);
  return BASE_VALUES[category][fatigueType];
}
