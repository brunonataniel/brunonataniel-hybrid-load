import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { PlateBreakdown, getPlateColor, getPlateLabel, UnitSystem } from '@/utils/plateCalculator';
import { Colors } from '@/constants/colors';

interface BarbellVisualProps {
  plates: PlateBreakdown[];
  unit: UnitSystem;
}

const PLATE_HEIGHT_MAP: Record<number, number> = {
  45: 86,
  25: 72,
  20: 77,
  15: 67,
  10: 58,
  5: 48,
  2.5: 38,
  1.25: 34,
};

const PLATE_WIDTH = 14;
const MAX_VISIBLE_PLATES = 6;
const ABSOLUTE_MAX_PLATES = 10;

function PlateView({ weight, index, unit, compact }: { weight: number; index: number; unit: UnitSystem; compact?: boolean }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: index * 50,
      useNativeDriver: true,
      tension: 140,
      friction: 8,
    }).start();
  }, [scaleAnim, index]);

  const baseHeight = PLATE_HEIGHT_MAP[weight] ?? 48;
  const height = compact ? baseHeight * 0.7 : baseHeight;
  const width = compact ? PLATE_WIDTH * 0.8 : PLATE_WIDTH;
  const color = getPlateColor(weight, unit);

  return (
    <Animated.View
      style={[
        styles.plate,
        {
          height,
          width,
          backgroundColor: color,
          transform: [{ scaleY: scaleAnim }],
          borderRadius: 3,
        },
      ]}
    />
  );
}

function MultiplierPlate({ count, color }: { count: number; color: string }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: 100,
      useNativeDriver: true,
      tension: 140,
      friction: 8,
    }).start();
  }, [scaleAnim]);

  return (
    <Animated.View
      style={[
        styles.multiplierPlate,
        {
          backgroundColor: color,
          transform: [{ scaleY: scaleAnim }],
        },
      ]}
    >
      <Text style={styles.multiplierText}>×{count}</Text>
    </Animated.View>
  );
}

function expandPlates(plates: PlateBreakdown[]): number[] {
  const result: number[] = [];
  for (const p of plates) {
    for (let i = 0; i < p.count; i++) {
      result.push(p.weight);
    }
  }
  return result;
}

function formatPlateLoadLabel(plates: PlateBreakdown[], unit: UnitSystem): string {
  if (plates.length === 0) return '';
  const unitLabel = unit === 'lbs' ? 'lb' : 'kg';
  const parts = plates.map((p) => {
    const label = getPlateLabel(p.weight);
    return `${p.count}×${label}${unitLabel}`;
  });
  return `Load: ${parts.join(', ')} per side`;
}

interface VisualPlate {
  type: 'plate' | 'multiplier';
  weight: number;
  count?: number;
  color?: string;
}

function buildVisualPlates(expanded: number[], unit: UnitSystem): { plates: VisualPlate[]; compact: boolean } {
  const totalPerSide = expanded.length;

  if (totalPerSide <= MAX_VISIBLE_PLATES) {
    return {
      plates: expanded.map((w) => ({ type: 'plate' as const, weight: w })),
      compact: false,
    };
  }

  if (totalPerSide <= ABSOLUTE_MAX_PLATES) {
    return {
      plates: expanded.map((w) => ({ type: 'plate' as const, weight: w })),
      compact: true,
    };
  }

  const visibleCount = MAX_VISIBLE_PLATES - 1;
  const visiblePlates = expanded.slice(0, visibleCount);
  const overflowCount = totalPerSide - visibleCount;
  const overflowWeight = expanded[visibleCount];
  const overflowColor = getPlateColor(overflowWeight, unit);

  return {
    plates: [
      ...visiblePlates.map((w) => ({ type: 'plate' as const, weight: w })),
      { type: 'multiplier' as const, weight: overflowWeight, count: overflowCount, color: overflowColor },
    ],
    compact: true,
  };
}

export default React.memo(function BarbellVisual({ plates, unit }: BarbellVisualProps) {
  const expanded = expandPlates(plates);
  const totalPerSide = expanded.length;

  const { plates: leftVisual, compact } = useMemo(
    () => buildVisualPlates([...expanded].reverse(), unit),
    [expanded, unit]
  );
  const { plates: rightVisual } = useMemo(
    () => buildVisualPlates(expanded, unit),
    [expanded, unit]
  );

  const loadLabel = useMemo(() => formatPlateLoadLabel(plates, unit), [plates, unit]);

  const barbellScale = useMemo(() => {
    if (totalPerSide <= MAX_VISIBLE_PLATES) return 1;
    if (totalPerSide <= ABSOLUTE_MAX_PLATES) return 0.85;
    return 0.75;
  }, [totalPerSide]);

  const plateGap = compact ? 1 : 2;

  return (
    <View style={styles.container}>
      <View style={[styles.barbell, { transform: [{ scale: barbellScale }], height: compact ? 90 : 108 }]}>
        <View style={styles.collar} />
        <View style={[styles.leftPlates, { gap: plateGap }]}>
          {leftVisual.map((vp, i) =>
            vp.type === 'multiplier' ? (
              <MultiplierPlate key={`lm-${i}`} count={vp.count ?? 0} color={vp.color ?? '#636366'} />
            ) : (
              <PlateView key={`l-${i}-${vp.weight}`} weight={vp.weight} index={i} unit={unit} compact={compact} />
            )
          )}
        </View>
        <View style={styles.sleeveLeft} />
        <View style={[styles.bar, compact && styles.barCompact]} />
        <View style={styles.sleeveRight} />
        <View style={[styles.rightPlates, { gap: plateGap }]}>
          {rightVisual.map((vp, i) =>
            vp.type === 'multiplier' ? (
              <MultiplierPlate key={`rm-${i}`} count={vp.count ?? 0} color={vp.color ?? '#636366'} />
            ) : (
              <PlateView key={`r-${i}-${vp.weight}`} weight={vp.weight} index={i} unit={unit} compact={compact} />
            )
          )}
        </View>
        <View style={styles.collar} />
      </View>
      {loadLabel.length > 0 && (
        <Text style={styles.loadLabel}>{loadLabel}</Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  barbell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 108,
  },
  bar: {
    width: 84,
    height: 6,
    backgroundColor: '#4A4A4C',
    borderRadius: 3,
  },
  barCompact: {
    width: 56,
  },
  sleeveLeft: {
    width: 12,
    height: 11,
    backgroundColor: '#3A3A3C',
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  sleeveRight: {
    width: 12,
    height: 11,
    backgroundColor: '#3A3A3C',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  collar: {
    width: 6,
    height: 17,
    backgroundColor: '#2C2C2E',
    borderRadius: 2,
  },
  leftPlates: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rightPlates: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  plate: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  multiplierPlate: {
    height: 52,
    width: 26,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  multiplierText: {
    fontSize: 9,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  loadLabel: {
    fontSize: 12,
    fontWeight: '500' as const,
    color: Colors.textTertiary,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
});
