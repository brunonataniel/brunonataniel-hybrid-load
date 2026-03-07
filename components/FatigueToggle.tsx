import React, { useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';

import * as Haptics from 'expo-haptics';
import { Swords, Footprints, Zap, Waves, PersonStanding } from 'lucide-react-native';
import { FatigueType, FATIGUE_OPTIONS, getFatigueReductionPercent } from '@/utils/plateCalculator';
import { Colors } from '@/constants/colors';

interface FatigueCheckInProps {
  value: FatigueType[];
  onChange: (types: FatigueType[]) => void;
  isProUnlocked: boolean;
  onProGateTriggered: () => void;
}

const ICON_MAP: Record<FatigueType, typeof Zap> = {
  combat: Swords,
  stairs: Footprints,
  hiit: Zap,
  swim: Waves,
  running: PersonStanding,
};

function FatigueOption({
  type,
  label,
  reduction,
  isActive,
  onToggle,
}: {
  type: FatigueType;
  label: string;
  reduction: string;
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
        <Text style={[styles.optionReduction, isActive && styles.optionReductionActive]}>
          -{reduction}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default React.memo(function FatigueCheckIn({ value, onChange, isProUnlocked, onProGateTriggered }: FatigueCheckInProps) {
  const totalReduction = getFatigueReductionPercent(value);

  const handleToggle = useCallback((type: FatigueType) => {
    const isActive = value.includes(type);
    if (isActive) {
      onChange(value.filter((t) => t !== type));
    } else {
      if (!isProUnlocked && value.length >= 1) {
        if (Platform.OS !== 'web') {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
        onProGateTriggered();
        return;
      }
      onChange([...value, type]);
    }
  }, [value, onChange, isProUnlocked, onProGateTriggered]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>FATIGUE CHECK-IN</Text>
        {totalReduction > 0 && (
          <View style={styles.totalBadge}>
            <Text style={styles.totalBadgeText}>-{totalReduction}%</Text>
            {totalReduction >= 30 && (
              <Text style={styles.cappedText}>CAPPED</Text>
            )}
          </View>
        )}
      </View>
      <View style={styles.grid}>
        {FATIGUE_OPTIONS.map((opt) => (
          <FatigueOption
            key={opt.type}
            type={opt.type}
            label={opt.label}
            reduction={opt.reduction}
            isActive={value.includes(opt.type)}
            onToggle={handleToggle}
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
  optionReductionActive: {
    color: Colors.accent,
    opacity: 1,
  },
});
