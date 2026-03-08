import React, { useCallback, useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated, Easing } from 'react-native';

import * as Haptics from 'expo-haptics';
import { Swords, Footprints, Zap, Waves, PersonStanding } from 'lucide-react-native';
import { FatigueType, LiftType, FATIGUE_OPTIONS, getFatigueReductionPercent, getMarginalFatiguePercent } from '@/utils/plateCalculator';
import { Colors } from '@/constants/colors';

interface FatigueCheckInProps {
  value: FatigueType[];
  onChange: (types: FatigueType[]) => void;
  selectedLift: LiftType;
}

const ICON_MAP: Record<FatigueType, typeof Zap> = {
  combat: Swords,
  stairs: Footprints,
  hiit: Zap,
  swim: Waves,
  running: PersonStanding,
};

function AnimatedPercent({ value }: { value: number }) {
  const [display, setDisplay] = useState<number>(value);
  const animRef = useRef(new Animated.Value(0)).current;
  const prevRef = useRef<number>(value);
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    if (from === to) return;

    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 80,
      useNativeDriver: true,
    }).start(() => {
      slideAnim.setValue(from > to ? -6 : 6);
      animRef.setValue(0);
      const listener = animRef.addListener(({ value: v }) => {
        setDisplay(Math.round(from + (to - from) * v));
      });

      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(animRef, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]).start(() => {
        setDisplay(to);
        prevRef.current = to;
        animRef.removeListener(listener);
      });
    });

    return () => {
      animRef.removeAllListeners();
    };
  }, [value, animRef, opacityAnim, slideAnim]);

  useEffect(() => {
    prevRef.current = value;
    setDisplay(value);
  }, [value]);

  return (
    <Animated.Text
      style={[
        styles.optionReduction,
        display > 0 && styles.optionReductionVisible,
        { opacity: opacityAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      -{display}%
    </Animated.Text>
  );
}

function FatigueOption({
  type,
  label,
  scaledPercent,
  isAdjusted,
  isActive,
  onToggle,
}: {
  type: FatigueType;
  label: string;
  scaledPercent: number;
  isAdjusted: boolean;
  isActive: boolean;
  onToggle: (type: FatigueType) => void;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const IconComponent = ICON_MAP[type];

  const handlePress = useCallback(() => {
    if (Platform.OS !== 'web') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 60, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    onToggle(type);
  }, [type, onToggle, scaleAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        testID={`fatigue-${type}`}
        style={[styles.option, isActive && styles.optionActive]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
          <IconComponent
            size={20}
            color={isActive ? '#0D0D0D' : Colors.textTertiary}
            strokeWidth={isActive ? 2.5 : 1.5}
          />
        </View>
        <Text style={[styles.optionLabel, isActive && styles.optionLabelActive]}>
          {label}
        </Text>
        <AnimatedPercent value={scaledPercent} />
        {isAdjusted && (
          <Text style={[styles.adjLabel, isActive && styles.adjLabelActive]}>ADJ.</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default React.memo(function FatigueCheckIn({ value, onChange, selectedLift }: FatigueCheckInProps) {
  const totalReduction = getFatigueReductionPercent(value, selectedLift);
  const totalOpacity = useRef(new Animated.Value(totalReduction > 0 ? 1 : 0)).current;
  const badgeScale = useRef(new Animated.Value(1)).current;
  const prevTotalRef = useRef<number>(totalReduction);

  useEffect(() => {
    const show = totalReduction > 0;
    Animated.timing(totalOpacity, {
      toValue: show ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();

    if (prevTotalRef.current !== totalReduction && totalReduction > 0) {
      Animated.sequence([
        Animated.timing(badgeScale, { toValue: 1.12, duration: 100, useNativeDriver: true }),
        Animated.timing(badgeScale, { toValue: 1, duration: 150, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();
    }
    prevTotalRef.current = totalReduction;
  }, [totalReduction, totalOpacity, badgeScale]);

  const handleToggle = useCallback((type: FatigueType) => {
    const isActive = value.includes(type);
    if (isActive) {
      onChange(value.filter((t) => t !== type));
    } else {
      onChange([...value, type]);
    }
  }, [value, onChange]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>FATIGUE CHECK-IN</Text>
        <Animated.View style={[styles.totalBadge, { opacity: totalOpacity, transform: [{ scale: badgeScale }] }]}>
          <Text style={styles.totalBadgeText}>-{totalReduction}%</Text>
          {totalReduction >= 30 && (
            <Text style={styles.cappedText}>CAPPED</Text>
          )}
        </Animated.View>
      </View>
      <View style={styles.grid}>
        {FATIGUE_OPTIONS.map((opt) => {
          const isActive = value.includes(opt.type);
          const marginal = getMarginalFatiguePercent(opt.type, selectedLift, value);
          return (
            <FatigueOption
              key={opt.type}
              type={opt.type}
              label={opt.label}
              scaledPercent={marginal.percent}
              isAdjusted={marginal.isAdjusted}
              isActive={isActive}
              onToggle={handleToggle}
            />
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 4,
    marginRight: 4,
  },
  title: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 1.2,
    color: Colors.textSecondary,
  },
  totalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.accentMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.2)',
  },
  totalBadgeText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.accent,
  },
  cappedText: {
    fontSize: 9,
    fontWeight: '700' as const,
    color: Colors.accent,
    opacity: 0.7,
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    gap: 8,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderRadius: 14,
    gap: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  optionActive: {
    backgroundColor: 'rgba(204, 255, 0, 0.06)',
    borderColor: Colors.accent,
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: Colors.accent,
  },
  optionLabel: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  optionLabelActive: {
    color: Colors.textPrimary,
  },
  optionReduction: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.textTertiary,
    opacity: 0.6,
  },
  optionReductionVisible: {
    color: Colors.textTertiary,
    opacity: 0.6,
  },
  optionReductionActive: {
    color: Colors.accent,
    opacity: 1,
  },
  adjLabel: {
    fontSize: 8,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    color: Colors.accent,
    opacity: 0.7,
    marginTop: -4,
  },
  adjLabelActive: {
    opacity: 1,
  },
});
