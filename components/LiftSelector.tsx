import React, { useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ArrowDown, Dumbbell, ArrowUp, Crown } from 'lucide-react-native';
import { LiftType } from '@/utils/plateCalculator';
import { Colors } from '@/constants/colors';

interface LiftSelectorProps {
  value: LiftType;
  onChange: (lift: LiftType) => void;
}

const LIFT_OPTIONS: { type: LiftType; label: string; tier: string }[] = [
  { type: 'squat', label: 'SQUAT', tier: 'A' },
  { type: 'bench', label: 'BENCH', tier: 'B' },
  { type: 'deadlift', label: 'DEAD', tier: 'A' },
  { type: 'overhead', label: 'OHP', tier: 'B' },
];

function LiftOption({
  type,
  label,
  tier,
  isActive,
  onPress,
}: {
  type: LiftType;
  label: string;
  tier: string;
  isActive: boolean;
  onPress: (type: LiftType) => void;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const IconComponent = type === 'squat' ? ArrowDown
    : type === 'bench' ? Dumbbell
    : type === 'deadlift' ? ArrowUp
    : Crown;

  const handlePress = useCallback(() => {
    if (Platform.OS !== 'web') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.92, duration: 50, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    onPress(type);
  }, [type, onPress, scaleAnim]);

  const isLower = tier === 'A';

  return (
    <Animated.View style={[styles.optionWrap, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        testID={`lift-${type}`}
        style={[styles.option, isActive && styles.optionActive]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
          <IconComponent
            size={18}
            color={isActive ? '#0D0D0D' : Colors.textTertiary}
            strokeWidth={isActive ? 2.5 : 1.5}
          />
        </View>
        <Text style={[styles.optionLabel, isActive && styles.optionLabelActive]}>
          {label}
        </Text>
        <View style={[styles.tierBadge, isLower ? styles.tierBadgeA : styles.tierBadgeB]}>
          <Text style={[styles.tierText, isLower ? styles.tierTextA : styles.tierTextB]}>
            {isLower ? 'FULL' : 'UPPER'}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default React.memo(function LiftSelector({ value, onChange }: LiftSelectorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>EXERCISE SELECT</Text>
        <View style={styles.scalingHint}>
          <Text style={styles.scalingHintText}>
            {value === 'squat' || value === 'deadlift' ? '100% FATIGUE LOAD' : 'SYSTEMIC SCALING'}
          </Text>
        </View>
      </View>
      <View style={styles.grid}>
        {LIFT_OPTIONS.map((opt) => (
          <LiftOption
            key={opt.type}
            type={opt.type}
            label={opt.label}
            tier={opt.tier}
            isActive={value === opt.type}
            onPress={onChange}
          />
        ))}
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
  scalingHint: {
    backgroundColor: 'rgba(204, 255, 0, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.12)',
  },
  scalingHintText: {
    fontSize: 9,
    fontWeight: '700' as const,
    letterSpacing: 1,
    color: Colors.accent,
    opacity: 0.7,
  },
  grid: {
    flexDirection: 'row',
    gap: 8,
  },
  optionWrap: {
    flex: 1,
  },
  option: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 14,
    gap: 6,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  optionActive: {
    backgroundColor: 'rgba(204, 255, 0, 0.06)',
    borderColor: Colors.accent,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    backgroundColor: Colors.accent,
  },
  optionLabel: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.8,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  optionLabelActive: {
    color: Colors.textPrimary,
  },
  tierBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  tierBadgeA: {
    backgroundColor: 'rgba(204, 255, 0, 0.08)',
  },
  tierBadgeB: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  tierText: {
    fontSize: 8,
    fontWeight: '700' as const,
    letterSpacing: 0.8,
  },
  tierTextA: {
    color: Colors.accent,
    opacity: 0.6,
  },
  tierTextB: {
    color: Colors.textTertiary,
    opacity: 0.6,
  },
});
