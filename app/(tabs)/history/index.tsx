import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Clock, Trash2, Swords, Footprints, Zap, Waves, PersonStanding, Dumbbell, ArrowDown, ArrowUp, Crown, Lock } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useApp, HistoryEntry } from '@/providers/AppProvider';
import ProUnlockModal from '@/components/ProUnlockModal';
import { FatigueType, UnitSystem, LiftType, convertWeight, getFatigueReductionPercent } from '@/utils/plateCalculator';

const FATIGUE_META: Record<FatigueType, { label: string; icon: typeof Zap; color: string }> = {
  combat: { label: 'Combat', icon: Swords, color: '#FF453A' },
  stairs: { label: 'Stairs', icon: Footprints, color: '#FF9F0A' },
  hiit: { label: 'HIIT', icon: Zap, color: '#BF5AF2' },
  swim: { label: 'Swim', icon: Waves, color: '#64D2FF' },
  running: { label: 'Run', icon: PersonStanding, color: '#30D158' },
};

const LIFT_META: Record<LiftType, { label: string; shortLabel: string; icon: typeof Dumbbell; color: string }> = {
  squat: { label: 'Squat', shortLabel: 'SQT', icon: ArrowDown, color: Colors.accent },
  bench: { label: 'Bench', shortLabel: 'BNC', icon: Dumbbell, color: '#64D2FF' },
  deadlift: { label: 'Deadlift', shortLabel: 'DL', icon: ArrowUp, color: '#FF9F0A' },
  overhead: { label: 'OHP', shortLabel: 'OHP', icon: Crown, color: '#BF5AF2' },
};

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;

  return `${month} ${day}, ${h}:${minutes} ${ampm}`;
}

function convertEntry(entry: HistoryEntry, targetUnit: UnitSystem): { finalWeight: number; oneRepMax: number; unit: UnitSystem } {
  if (entry.unit === targetUnit) {
    return { finalWeight: entry.finalWeight, oneRepMax: entry.oneRepMax, unit: targetUnit };
  }
  return {
    finalWeight: Math.round(convertWeight(entry.finalWeight, entry.unit, targetUnit)),
    oneRepMax: Math.round(convertWeight(entry.oneRepMax, entry.unit, targetUnit) * 10) / 10,
    unit: targetUnit,
  };
}

function FatigueIcons({ types }: { types: FatigueType[] }) {
  if (types.length === 0) {
    return (
      <View style={styles.fatigueRow}>
        <Zap size={12} color={Colors.accent} strokeWidth={2} />
        <Text style={[styles.cardDetailValue, { color: Colors.accent }]}>Fresh</Text>
      </View>
    );
  }

  return (
    <View style={styles.fatigueRow}>
      {types.map((t) => {
        const meta = FATIGUE_META[t];
        const Icon = meta.icon;
        return <Icon key={t} size={12} color={meta.color} strokeWidth={2} />;
      })}
      <Text style={[styles.cardDetailValue, { color: Colors.accent }]}>
        -{getFatigueReductionPercent(types)}%
      </Text>
    </View>
  );
}

function LiftBadge({ liftType }: { liftType?: LiftType }) {
  const meta = liftType ? LIFT_META[liftType] : null;
  if (!meta) return null;
  const Icon = meta.icon;
  return (
    <View style={[styles.liftBadge, { backgroundColor: `${meta.color}15` }]}>
      <Icon size={11} color={meta.color} strokeWidth={2.5} />
      <Text style={[styles.liftBadgeText, { color: meta.color }]}>{meta.shortLabel}</Text>
    </View>
  );
}

function HistoryCard({ entry, globalUnit }: { entry: HistoryEntry; globalUnit: UnitSystem }) {
  const fatigueTypes = entry.fatigueTypes ?? [];
  const converted = convertEntry(entry, globalUnit);
  const unitLabel = converted.unit === 'lbs' ? 'LBS' : 'KG';

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.cardWeight}>{converted.finalWeight}</Text>
        <Text style={styles.cardUnit}>{unitLabel}</Text>
        <View style={styles.cardSpacer} />
        <View style={styles.cardTopRight}>
          <LiftBadge liftType={entry.liftType} />
          <Text style={styles.cardDate}>{formatDate(entry.timestamp)}</Text>
        </View>
      </View>
      <View style={styles.cardBottom}>
        <View style={styles.cardDetail}>
          <Text style={styles.cardDetailLabel}>Max</Text>
          <Text style={styles.cardDetailValue}>{converted.oneRepMax} {unitLabel}</Text>
        </View>
        <View style={styles.cardDivider} />
        <View style={styles.cardDetail}>
          <Text style={styles.cardDetailLabel}>Target</Text>
          <Text style={styles.cardDetailValue}>{entry.targetPercent}%</Text>
        </View>
        <View style={styles.cardDivider} />
        <View style={styles.cardDetail}>
          <Text style={styles.cardDetailLabel}>Fatigue</Text>
          <FatigueIcons types={fatigueTypes} />
        </View>
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const { history, clearHistory, unit, isProUnlocked } = useApp();
  const [showProModal, setShowProModal] = useState<boolean>(false);

  const handleClear = useCallback(() => {
    if (Platform.OS !== 'web') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    clearHistory();
  }, [clearHistory]);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
          {history.length > 0 && (
            <TouchableOpacity
              testID="clear-history"
              style={styles.clearButton}
              onPress={handleClear}
              activeOpacity={0.6}
            >
              <Trash2 size={14} color={Colors.textSecondary} />
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {!isProUnlocked ? (
          <View style={styles.lockedContainer}>
            <View style={styles.lockIconWrap}>
              <Lock size={36} color={Colors.accent} strokeWidth={1.5} />
            </View>
            <Text style={styles.lockedTitle}>Track every session. See your training patterns.</Text>
            <TouchableOpacity
              testID="unlock-pro-history"
              style={styles.unlockButton}
              onPress={() => setShowProModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.unlockButtonText}>UNLOCK PRO</Text>
            </TouchableOpacity>
            <ProUnlockModal visible={showProModal} onClose={() => setShowProModal(false)} />
          </View>
        ) : history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrap}>
              <Clock size={36} color={Colors.textTertiary} strokeWidth={1.2} />
            </View>
            <Text style={styles.emptyTitle}>No history yet</Text>
            <Text style={styles.emptySubtitle}>
              Your last 5 calculated loads will appear here
            </Text>
          </View>
        ) : (
          <View style={styles.scrollWrapper}>
            <ScrollView
              testID="history-scroll"
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {history.map((entry) => (
                <HistoryCard key={entry.id} entry={entry} globalUnit={unit} />
              ))}
              <Text style={styles.footerNote}>Showing last {history.length} calculation{history.length !== 1 ? 's' : ''}</Text>
            </ScrollView>
            <LinearGradient
              colors={[`${Colors.background}00`, Colors.background]}
              style={styles.fadeOverlay}
              pointerEvents="none"
            />
          </View>
        )}
      </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  clearText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
  },
  scrollWrapper: {
    flex: 1,
    position: 'relative' as const,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 10,
  },
  fadeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 48,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  cardWeight: {
    fontSize: 36,
    fontWeight: '200' as const,
    color: Colors.textPrimary,
    letterSpacing: -1.5,
  },
  cardUnit: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.textSecondary,
    letterSpacing: 1,
    marginLeft: 6,
  },
  cardSpacer: {
    flex: 1,
  },
  cardTopRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  liftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  liftBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
  },
  cardDate: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: Colors.textTertiary,
  },
  cardBottom: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cardDetail: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  cardDetailLabel: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: Colors.textTertiary,
    letterSpacing: 0.3,
    textTransform: 'uppercase' as const,
  },
  cardDetailValue: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  cardDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  fatigueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  lockedContainer: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingBottom: 80,
    paddingHorizontal: 32,
    gap: 18,
  },
  lockIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(204, 255, 0, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.15)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  lockedTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    textAlign: 'center' as const,
    lineHeight: 23,
  },
  unlockButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 36,
    alignItems: 'center' as const,
    marginTop: 4,
  },
  unlockButtonText: {
    fontSize: 13,
    fontWeight: '800' as const,
    letterSpacing: 1.5,
    color: '#0D0D0D',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textTertiary,
    textAlign: 'center',
    maxWidth: 220,
    lineHeight: 20,
  },
  footerNote: {
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginTop: 6,
  },
});
