export type UnitSystem = 'lbs' | 'kg';

export type FatigueType = 'combat' | 'stairs' | 'hiit' | 'swim' | 'running';

export type LiftType = 'squat' | 'bench' | 'deadlift' | 'overhead';

export type FatigueState = 'fresh' | 'standard' | 'endurance';

const BAR_WEIGHT_LBS = 45;
const BAR_WEIGHT_KG = 20;

const PLATE_WEIGHTS_LBS = [45, 25, 10, 5, 2.5] as const;
const PLATE_WEIGHTS_KG = [25, 20, 15, 10, 5, 2.5, 1.25] as const;

export type PlateWeight = number;

export interface PlateBreakdown {
  weight: PlateWeight;
  count: number;
}

export interface CalculationResult {
  targetWeight: number;
  adjustedWeight: number;
  finalWeight: number;
  weightPerSide: number;
  plates: PlateBreakdown[];
  fatigueReduction: number;
  barWeight: number;
}

const FATIGUE_BASE: Record<FatigueType, number> = {
  combat: 0.15,
  stairs: 0.10,
  hiit: 0.10,
  swim: 0.10,
  running: 0.10,
};

const SYSTEMIC_PENALTY = 0.03;

const MAX_FATIGUE_REDUCTION = 0.30;

function getAnchorBase(activeFatigues: FatigueType[]): number {
  if (activeFatigues.includes('combat')) return 0.15;
  if (activeFatigues.length > 0) return 0.10;
  return 0;
}

export function computeTotalReduction(activeFatigues: FatigueType[], _lift: LiftType = 'squat'): number {
  if (activeFatigues.length === 0) return 0;

  const anchorBase = getAnchorBase(activeFatigues);
  const additionalCount = activeFatigues.length - 1;
  const totalReduction = anchorBase + (additionalCount * SYSTEMIC_PENALTY);

  console.log(`[HeavyCombatEngine] Anchor base: -${(anchorBase * 100).toFixed(0)}%, additional tags: ${additionalCount}, penalty: -${(additionalCount * SYSTEMIC_PENALTY * 100).toFixed(0)}%, total: -${(totalReduction * 100).toFixed(0)}%`);

  return Math.min(totalReduction, MAX_FATIGUE_REDUCTION);
}

export function getFatigueReductionPercent(activeFatigues: FatigueType[], lift: LiftType = 'squat'): number {
  return Math.round(computeTotalReduction(activeFatigues, lift) * 100);
}

function getRoundingIncrement(unit: UnitSystem): number {
  return unit === 'lbs' ? 5 : 2.5;
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
  const totalReduction = computeTotalReduction(activeFatigues, lift);
  const fatigueReductionPercent = Math.round(totalReduction * 100);

  const effectivePercent = Math.max(0, targetPercent - fatigueReductionPercent);
  const targetWeight = (oneRepMax * targetPercent) / 100;
  const adjustedWeight = (oneRepMax * effectivePercent) / 100;
  const increment = getRoundingIncrement(unit);
  const finalWeight = Math.floor(adjustedWeight / increment) * increment;
  const barWeight = getBarWeight(unit);
  const weightPerSide = Math.max(0, (finalWeight - barWeight) / 2);

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

  return {
    targetWeight: Math.round(targetWeight * 10) / 10,
    adjustedWeight: Math.round(adjustedWeight * 10) / 10,
    finalWeight: Math.max(barWeight, finalWeight),
    weightPerSide,
    plates,
    fatigueReduction: fatigueReductionPercent > 0 ? -fatigueReductionPercent : 0,
    barWeight,
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
  { type: 'stairs', label: 'Stairs', reduction: '10%' },
  { type: 'hiit', label: 'HIIT', reduction: '10%' },
  { type: 'swim', label: 'Swim', reduction: '10%' },
  { type: 'running', label: 'Run', reduction: '10%' },
];

export function getScaledFatiguePercent(fatigueType: FatigueType, _lift: LiftType): number {
  return Math.round((FATIGUE_BASE[fatigueType] ?? 0) * 100);
}

export function getMarginalFatiguePercent(
  fatigueType: FatigueType,
  _lift: LiftType,
  activeFatigues: FatigueType[],
): { percent: number; isAdjusted: boolean } {
  const fullPercent = Math.round((FATIGUE_BASE[fatigueType] ?? 0) * 100);
  const penaltyPercent = Math.round(SYSTEMIC_PENALTY * 100);

  if (activeFatigues.length === 0) {
    return { percent: fullPercent, isAdjusted: false };
  }

  const isActive = activeFatigues.includes(fatigueType);

  if (isActive) {
    if (activeFatigues.length === 1) {
      return { percent: fullPercent, isAdjusted: false };
    }

    const isAnchor = isTagTheAnchor(fatigueType, activeFatigues);
    if (isAnchor) {
      const anchorBase = getAnchorBase(activeFatigues);
      const anchorPercent = Math.round(anchorBase * 100);
      console.log(`[MarginalPreview] Active anchor ${fatigueType}: ${anchorPercent}%`);
      return { percent: anchorPercent, isAdjusted: false };
    }

    console.log(`[MarginalPreview] Active non-anchor ${fatigueType}: ${penaltyPercent}% ADJ`);
    return { percent: penaltyPercent, isAdjusted: true };
  }

  const wouldBeAnchor = isTagTheAnchor(fatigueType, [...activeFatigues, fatigueType]);
  if (wouldBeAnchor) {
    const newAnchorBase = getAnchorBase([...activeFatigues, fatigueType]);
    const currentAnchorBase = getAnchorBase(activeFatigues);
    if (newAnchorBase > currentAnchorBase) {
      const upgradeContribution = Math.round((newAnchorBase - currentAnchorBase + SYSTEMIC_PENALTY) * 100);
      console.log(`[MarginalPreview] Inactive would-be-anchor ${fatigueType}: ${upgradeContribution}% (anchor upgrade)`);
      return { percent: upgradeContribution, isAdjusted: upgradeContribution !== fullPercent };
    }
    return { percent: fullPercent, isAdjusted: false };
  }

  console.log(`[MarginalPreview] Inactive non-anchor ${fatigueType}: ${penaltyPercent}% ADJ`);
  return { percent: penaltyPercent, isAdjusted: true };
}

function isTagTheAnchor(fatigueType: FatigueType, fatigues: FatigueType[]): boolean {
  if (fatigues.includes('combat')) {
    return fatigueType === 'combat';
  }
  return fatigues[0] === fatigueType || fatigues.indexOf(fatigueType) === 0;
}
