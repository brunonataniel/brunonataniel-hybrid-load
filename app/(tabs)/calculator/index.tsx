import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Animated,
  KeyboardAvoidingView,
  Easing,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Weight, RotateCcw, Info, X, Lock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { calculatePlates, FatigueType, getPlateColor, getPlateLabel, PlateBreakdown, UnitSystem, getBarWeight, getFatigueReductionPercent } from '@/utils/plateCalculator';
import BarbellVisual from '@/components/BarbellVisual';
import FatigueCheckIn from '@/components/FatigueToggle';
import LiftSelector from '@/components/LiftSelector';
import { useApp } from '@/providers/AppProvider';
import ProUnlockModal from '@/components/ProUnlockModal';

const PERCENTAGES = [50, 60, 70, 80, 90, 100] as const;

function EngineTooltip() {
  const [visible, setVisible] = useState<boolean>(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const show = useCallback(() => {
    setVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const hide = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  }, [fadeAnim]);

  const toggle = useCallback(() => {
    if (visible) {
      hide();
    } else {
      show();
    }
  }, [visible, show, hide]);

  return (
    <>
      <TouchableOpacity
        testID="engine-info-icon"
        onPress={toggle}
        activeOpacity={0.6}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        style={tooltipStyles.iconTouch}
      >
        <Info size={14} color={Colors.textTertiary} />
      </TouchableOpacity>

      {visible && (
        <Modal
          transparent
          animationType="none"
          visible={visible}
          onRequestClose={hide}
          statusBarTranslucent
        >
          <Pressable style={tooltipStyles.overlay} onPress={hide}>
            <Animated.View style={[tooltipStyles.tooltipBox, { opacity: fadeAnim }]}>
              <View style={tooltipStyles.tooltipHeader}>
                <Text style={tooltipStyles.tooltipTitle}>HYBRID LOAD ENGINE</Text>
                <TouchableOpacity onPress={hide} activeOpacity={0.6} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <X size={16} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
              <View style={tooltipStyles.divider} />
              <Text style={tooltipStyles.tooltipBody}>
                This isn't a simple percentage of your Max. The Engine calculates your "Target Capacity," automatically down-adjusting the load based on your selected Fatigue Check-In inputs (e.g., Combat, HIIT).
              </Text>
            </Animated.View>
          </Pressable>
        </Modal>
      )}
    </>
  );
}

const tooltipStyles = StyleSheet.create({
  iconTouch: {
    marginLeft: 6,
    padding: 2,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  tooltipBox: {
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(204, 255, 0, 0.35)',
    paddingHorizontal: 20,
    paddingVertical: 18,
    maxWidth: 360,
    width: '100%',
    shadowColor: '#CCFF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 12,
  },
  tooltipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tooltipTitle: {
    fontSize: 12,
    fontWeight: '800' as const,
    letterSpacing: 1.8,
    color: '#CCFF00',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 12,
  },
  tooltipBody: {
    fontSize: 14,
    lineHeight: 21,
    color: '#FFFFFF',
    fontWeight: '400' as const,
  },
});

function PlateRow({ plate, unit }: { plate: PlateBreakdown; unit: UnitSystem }) {
  const color = getPlateColor(plate.weight, unit);
  const unitLabel = unit === 'lbs' ? 'lb' : 'kg';
  const isLargeMultiplier = plate.count >= 100;
  return (
    <View style={styles.plateRow}>
      <View style={styles.plateChipCountGroup}>
        <View style={[styles.plateChip, { backgroundColor: color }]}>
          <Text style={[styles.plateChipText, unit === 'kg' && plate.weight === 5 && { color: '#1A1A1A' }]}>{getPlateLabel(plate.weight)}</Text>
        </View>
        <Text style={[styles.plateCount, isLargeMultiplier && styles.plateCountSmall]}>
          <Text style={styles.plateCountX}>×</Text>{plate.count}
        </Text>
      </View>
      <Text style={styles.plateLabel}>{plate.weight} {unitLabel} each side</Text>
    </View>
  );
}

function useCountingAnimation(targetValue: number, duration: number = 350) {
  const [displayValue, setDisplayValue] = useState<number>(targetValue);
  const animRef = useRef(new Animated.Value(0)).current;
  const prevValueRef = useRef<number>(targetValue);

  useEffect(() => {
    const from = prevValueRef.current;
    const to = targetValue;
    if (from === to) return;

    animRef.setValue(0);
    const listener = animRef.addListener(({ value }) => {
      const current = Math.round(from + (to - from) * value);
      setDisplayValue(current);
    });

    Animated.timing(animRef, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(() => {
      setDisplayValue(to);
      prevValueRef.current = to;
    });

    return () => {
      animRef.removeListener(listener);
    };
  }, [targetValue, duration, animRef]);

  useEffect(() => {
    prevValueRef.current = targetValue;
    setDisplayValue(targetValue);
  }, [targetValue]);

  return displayValue;
}

export default function CalculatorScreen() {
  const { maxLift, unit, updateMaxLift, updateUnit, addHistoryEntry, selectedLift, updateLift, isProUnlocked } = useApp();
  const [showProModal, setShowProModal] = useState<boolean>(false);
  const router = useRouter();
  const [targetPercent, setTargetPercent] = useState<number>(80);
  const [activeFatigues, setActiveFatigues] = useState<FatigueType[]>([]);
  const weightAnim = useRef(new Animated.Value(1)).current;
  const lastLoggedRef = useRef<string>('');
  const cnsOpacity = useRef(new Animated.Value(0)).current;

  const numericMax = useMemo(() => {
    const val = parseFloat(maxLift);
    return isNaN(val) || val <= 0 ? 0 : val;
  }, [maxLift]);

  const result = useMemo(
    () => calculatePlates(numericMax, targetPercent, activeFatigues, unit, selectedLift),
    [numericMax, targetPercent, activeFatigues, unit, selectedLift]
  );

  const totalReductionPercent = useMemo(
    () => getFatigueReductionPercent(activeFatigues, selectedLift),
    [activeFatigues, selectedLift]
  );

  useEffect(() => {
    Animated.timing(cnsOpacity, {
      toValue: totalReductionPercent > 0 ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [totalReductionPercent, cnsOpacity]);

  useEffect(() => {
    if (numericMax <= 0) return;
    const fatigueKey = [...activeFatigues].sort().join(',');
    const key = `${numericMax}-${targetPercent}-${fatigueKey}-${unit}-${result.finalWeight}`;
    if (key === lastLoggedRef.current) return;
    lastLoggedRef.current = key;

    const timer = setTimeout(() => {
      addHistoryEntry({
        oneRepMax: numericMax,
        targetPercent,
        fatigueTypes: activeFatigues,
        unit,
        finalWeight: result.finalWeight,
        liftType: selectedLift,
      });
    }, 1500);
    return () => clearTimeout(timer);
  }, [numericMax, targetPercent, activeFatigues, unit, result.finalWeight, addHistoryEntry, selectedLift]);

  const handlePercentChange = useCallback((pct: number) => {
    if (Platform.OS !== 'web') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setTargetPercent(pct);
    Animated.sequence([
      Animated.timing(weightAnim, { toValue: 1.03, duration: 80, useNativeDriver: true }),
      Animated.timing(weightAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  }, [weightAnim]);

  const handleFatigueChange = useCallback((types: FatigueType[]) => {
    setActiveFatigues(types);
    Animated.sequence([
      Animated.timing(weightAnim, { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.timing(weightAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  }, [weightAnim]);

  const animatedWeight = useCountingAnimation(result.finalWeight, 400);

  const handleUnitChange = useCallback((newUnit: UnitSystem) => {
    if (Platform.OS !== 'web') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    updateUnit(newUnit);
    Animated.sequence([
      Animated.timing(weightAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(weightAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [updateUnit, weightAnim]);

  const handleReset = useCallback(() => {
    if (Platform.OS !== 'web') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    updateMaxLift(unit === 'lbs' ? '315' : '140');
    setTargetPercent(80);
    setActiveFatigues([]);
  }, [unit, updateMaxLift]);


  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <Text style={styles.appTitle}>Hybrid Load</Text>
              </View>
              <View style={styles.headerRight}>
                <View style={styles.unitPicker}>
                  <TouchableOpacity
                    testID="unit-lbs"
                    style={[styles.unitOption, unit === 'lbs' && styles.unitOptionActive]}
                    onPress={() => handleUnitChange('lbs')}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.unitOptionText, unit === 'lbs' && styles.unitOptionTextActive]}>LBS</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    testID="unit-kg"
                    style={[styles.unitOption, unit === 'kg' && styles.unitOptionActive]}
                    onPress={() => handleUnitChange('kg')}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.unitOptionText, unit === 'kg' && styles.unitOptionTextActive]}>KG</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  testID="reset-button"
                  style={styles.resetButton}
                  onPress={handleReset}
                  activeOpacity={0.6}
                >
                  <RotateCcw size={16} color={Colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity
                  testID="info-button"
                  style={styles.resetButton}
                  onPress={() => router.push('/' as any)}
                  activeOpacity={0.6}
                >
                  <Info size={16} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>

            <Animated.View style={[styles.weightHero, { transform: [{ scale: weightAnim }] }]}>
              <Text style={styles.weightHeroValue}>{animatedWeight}</Text>
              <Text style={styles.weightHeroUnit}>{unit === 'lbs' ? 'LBS' : 'KG'}</Text>
              <View style={styles.weightMeta}>
                {totalReductionPercent > 0 && (
                  <View style={styles.fatiguePill}>
                    <Text style={styles.fatiguePillText}>-{totalReductionPercent}%</Text>
                  </View>
                )}
                <Text style={styles.weightMetaText}>
                  {numericMax > 0 ? `${targetPercent}% of ${numericMax}` : 'Enter your max'}
                </Text>
              </View>
              <Animated.View style={[styles.cnsAdjustment, { opacity: cnsOpacity }]}>
                <Text style={styles.cnsText}>
                  CNS ADJUSTMENT: -{totalReductionPercent}%
                </Text>
              </Animated.View>

              {activeFatigues.length === 0 && numericMax > 0 && (
                <Text style={styles.freshText}>Fresh and ready. Full send.</Text>
              )}

              {result.breakdown.length > 0 && (
                <View style={styles.breakdownContainer}>
                  {result.breakdown.map((item) => (
                    <View key={item.type} style={styles.breakdownRow}>
                      <View style={[
                        styles.breakdownRoleBadge,
                        item.role === 'anchor' ? styles.breakdownAnchorBadge : styles.breakdownModBadge,
                      ]}>
                        <Text style={[
                          styles.breakdownRoleText,
                          item.role === 'anchor' ? styles.breakdownAnchorText : styles.breakdownModText,
                        ]}>
                          {item.role === 'anchor' ? 'ANCHOR' : 'MOD'}
                        </Text>
                      </View>
                      <Text style={styles.breakdownLabel}>{item.label}</Text>
                      <Text style={styles.breakdownValue}>-{item.value}%</Text>
                    </View>
                  ))}
                  {result.volumeMultiplier > 0 && (
                    <View style={styles.breakdownRow}>
                      <View style={[styles.breakdownRoleBadge, styles.breakdownVolBadge]}>
                        <Text style={[styles.breakdownRoleText, styles.breakdownVolText]}>VOL</Text>
                      </View>
                      <Text style={styles.breakdownLabel}>Overload</Text>
                      <Text style={styles.breakdownValue}>-{result.volumeMultiplier}%</Text>
                    </View>
                  )}
                </View>
              )}
            </Animated.View>

            <View style={styles.inputSection}>
              <Text style={styles.sectionLabel}>1-REP MAX</Text>
              <View style={styles.inputRow}>
                <TextInput
                  testID="one-rep-max-input"
                  style={styles.maxInput}
                  value={maxLift}
                  onChangeText={updateMaxLift}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={Colors.textTertiary}
                  selectionColor={Colors.accent}
                  maxLength={4}
                />
                <View style={styles.inputUnitWrap}>
                  <Text style={styles.inputUnit}>{unit === 'lbs' ? 'LBS' : 'KG'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.percentSection}>
              <View style={styles.sectionLabelRow}>
                <Text style={styles.sectionLabel}>TARGET %</Text>
                <EngineTooltip />
              </View>
              <View style={styles.percentPillRow}>
                {PERCENTAGES.map((pct) => {
                  const isActive = pct === targetPercent;
                  return (
                    <TouchableOpacity
                      key={pct}
                      testID={`percent-${pct}`}
                      style={[
                        styles.percentPill,
                        isActive && styles.percentPillActive,
                      ]}
                      onPress={() => handlePercentChange(pct)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.percentPillText, isActive && styles.percentPillTextActive]}>
                        {pct}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <LiftSelector
              value={selectedLift}
              onChange={updateLift}
            />

            <FatigueCheckIn
              value={activeFatigues}
              onChange={handleFatigueChange}
              selectedLift={selectedLift}
            />

            {isProUnlocked ? (
              <>
                <BarbellVisual plates={result.plates} unit={unit} lift={selectedLift} />

                {result.plates.length > 0 ? (
                  <View style={styles.plateBreakdown}>
                    <Text style={styles.sectionLabel}>PLATES PER SIDE</Text>
                    <View style={styles.plateList}>
                      {result.plates.map((plate) => (
                        <PlateRow key={plate.weight} plate={plate} unit={unit} />
                      ))}
                    </View>
                    <Text style={styles.barNote}>Bar: {result.barWeight} {unit}</Text>
                  </View>
                ) : (
                  <View style={styles.emptyState}>
                    <Weight size={28} color={Colors.textTertiary} />
                    <Text style={styles.emptyText}>
                      {numericMax === 0 ? 'Enter your 1-rep max' : `Just the bar — ${getBarWeight(unit)} ${unit}`}
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <View style={styles.lockedSection}>
                <View style={styles.lockedPreview}>
                  <View style={styles.blurredBarbell}>
                    <View style={styles.blurCollar} />
                    <View style={styles.blurPlate} />
                    <View style={styles.blurPlateSmall} />
                    <View style={styles.blurSleeve} />
                    <View style={styles.blurBar} />
                    <View style={styles.blurSleeve} />
                    <View style={styles.blurPlateSmall} />
                    <View style={styles.blurPlate} />
                    <View style={styles.blurCollar} />
                  </View>
                  <View style={styles.lockOverlay}>
                    <View style={styles.lockIconWrap}>
                      <Lock size={28} color={Colors.accent} strokeWidth={2} />
                    </View>
                  </View>
                </View>
                <Text style={styles.lockedText}>See your exact plate setup</Text>
                <TouchableOpacity
                  testID="unlock-pro-plates"
                  style={styles.unlockButton}
                  onPress={() => setShowProModal(true)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.unlockButtonText}>UNLOCK PRO</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.legalFooter}>
              <View style={styles.legalDivider} />
              <View style={styles.legalRow}>
                <TouchableOpacity onPress={() => router.push('/impressum')} testID="calc-impressum">
                  <Text style={styles.legalText}>Imprint / Impressum</Text>
                </TouchableOpacity>
                <View style={styles.legalDot} />
                <TouchableOpacity onPress={() => router.push('/privacy')} testID="calc-privacy">
                  <Text style={styles.legalText}>Privacy Policy / Datenschutz</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

            <ProUnlockModal visible={showProModal} onClose={() => setShowProModal(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 10,
  },
  unitPicker: {
    flexDirection: 'row' as const,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  unitOption: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 7,
  },
  unitOptionActive: {
    backgroundColor: Colors.surfaceElevated,
  },
  unitOptionText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    opacity: 0.8,
  },
  unitOptionTextActive: {
    color: Colors.textPrimary,
    opacity: 1,
  },
  resetButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  weightHero: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 16,
  },
  weightHeroValue: {
    fontSize: 96,
    fontWeight: '200' as const,
    color: Colors.textPrimary,
    letterSpacing: -4,
    lineHeight: 100,
  },
  weightHeroUnit: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    letterSpacing: 6,
    marginTop: 6,
    opacity: 0.7,
  },
  weightMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
  },
  fatiguePill: {
    backgroundColor: Colors.accentMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.2)',
  },
  fatiguePillText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.accent,
  },
  weightMetaText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  cnsAdjustment: {
    marginTop: 10,
    backgroundColor: 'rgba(204, 255, 0, 0.05)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.1)',
  },
  cnsText: {
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 1.5,
    color: Colors.accent,
    opacity: 0.8,
  },
  inputSection: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600' as const,
    letterSpacing: 1.2,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputRow: {
    position: 'relative' as const,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  maxInput: {
    flex: 1,
    fontSize: 34,
    fontWeight: '300' as const,
    color: Colors.textPrimary,
    padding: 0,
    paddingRight: 50,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {}),
  },
  inputUnitWrap: {
    position: 'absolute' as const,
    right: 18,
    top: 0,
    bottom: 0,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    zIndex: 2,
  },
  inputUnit: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    letterSpacing: 1.2,
  },
  percentSection: {
    gap: 10,
  },
  percentPillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  percentPill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  percentPillActive: {
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
    borderColor: Colors.accent,
    borderWidth: 1.5,
  },
  percentPillText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textTertiary,
  },
  percentPillTextActive: {
    color: Colors.accent,
    fontWeight: '700' as const,
  },
  plateBreakdown: {
    gap: 8,
  },
  plateList: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  plateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    gap: 14,
  },
  plateChipCountGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 78,
  },
  plateChip: {
    width: 38,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plateChipText: {
    fontSize: 11,
    fontWeight: '800' as const,
    color: '#FFFFFF',
  },
  plateCount: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  plateCountSmall: {
    fontSize: 15,
  },
  plateCountX: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  plateLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  barNote: {
    fontSize: 13,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
  legalFooter: {
    marginTop: 12,
    paddingBottom: 8,
  },
  legalDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: 16,
  },
  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  legalText: {
    fontSize: 10,
    color: '#555555',
    fontWeight: '400' as const,
  },
  legalDot: {
    width: 2.5,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: Colors.textTertiary,
    opacity: 0.5,
  },
  freshText: {
    fontSize: 13,
    color: Colors.textTertiary,
    marginTop: 8,
    letterSpacing: 0.3,
  },
  lockedSection: {
    alignItems: 'center' as const,
    gap: 14,
    paddingVertical: 8,
  },
  lockedPreview: {
    width: '100%' as const,
    height: 108,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    position: 'relative' as const,
  },
  blurredBarbell: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    opacity: 0.15,
  },
  blurBar: {
    width: 84,
    height: 6,
    backgroundColor: '#4A4A4C',
    borderRadius: 3,
  },
  blurSleeve: {
    width: 12,
    height: 11,
    backgroundColor: '#3A3A3C',
    borderRadius: 2,
  },
  blurCollar: {
    width: 6,
    height: 17,
    backgroundColor: '#2C2C2E',
    borderRadius: 2,
  },
  blurPlate: {
    width: 14,
    height: 72,
    backgroundColor: '#636366',
    borderRadius: 3,
  },
  blurPlateSmall: {
    width: 14,
    height: 52,
    backgroundColor: '#636366',
    borderRadius: 3,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  lockIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(204, 255, 0, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.2)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  lockedText: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
    textAlign: 'center' as const,
  },
  unlockButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center' as const,
  },
  unlockButtonText: {
    fontSize: 13,
    fontWeight: '800' as const,
    letterSpacing: 1.5,
    color: '#0D0D0D',
  },
  breakdownContainer: {
    marginTop: 12,
    gap: 6,
    width: '100%',
    paddingHorizontal: 20,
  },
  breakdownRow: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 8,
  },
  breakdownRoleBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 52,
    alignItems: 'center' as const,
  },
  breakdownAnchorBadge: {
    backgroundColor: 'rgba(204, 255, 0, 0.12)',
  },
  breakdownModBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  breakdownVolBadge: {
    backgroundColor: 'rgba(255, 149, 0, 0.12)',
  },
  breakdownRoleText: {
    fontSize: 9,
    fontWeight: '700' as const,
    letterSpacing: 0.8,
  },
  breakdownAnchorText: {
    color: Colors.accent,
  },
  breakdownModText: {
    color: Colors.textSecondary,
  },
  breakdownVolText: {
    color: '#FF9500',
  },
  breakdownLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  breakdownValue: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
});
