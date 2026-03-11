import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trash2, Dumbbell } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/colors';
import { useApp, HistoryEntry } from '@/providers/AppProvider';

const LIFT_LABELS: Record<string, string> = {
  squat: 'Squat',
  bench: 'Bench',
  deadlift: 'Deadlift',
  overhead: 'OHP',
};

const LIFT_SHORT: Record<string, string> = {
  squat: 'SQT',
  bench: 'BNC',
  deadlift: 'DL',
  overhead: 'OHP',
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

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const HistoryCard = React.memo(function HistoryCard({ item }: { item: HistoryEntry }) {
  const liftLabel = LIFT_LABELS[item.lift] ?? item.lift ?? 'Unknown';
  const liftShort = LIFT_SHORT[item.lift] ?? (item.lift ? item.lift.toUpperCase() : '???');
  const unitLabel = item.unit === 'lbs' ? 'LBS' : 'KG';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.liftBadge}>
          <Text style={styles.liftBadgeText}>{liftShort}</Text>
        </View>
        <Text style={styles.liftName}>{liftLabel}</Text>
        <Text style={styles.cardTime}>{formatDate(item.timestamp)}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.weightBlock}>
          <Text style={styles.weightValue}>{item.finalWeight}</Text>
          <Text style={styles.weightUnit}>{unitLabel}</Text>
        </View>
        <View style={styles.metaBlock}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>1RM</Text>
            <Text style={styles.metaValue}>{item.oneRepMax} {unitLabel}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Target</Text>
            <Text style={styles.metaValue}>{item.targetPercent}%</Text>
          </View>
          {item.totalPenalty > 0 && (
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Fatigue</Text>
              <View style={styles.penaltyPill}>
                <Text style={styles.penaltyText}>-{item.totalPenalty}%</Text>
              </View>
            </View>
          )}
        </View>
      </View>
      {item.fatigues.length > 0 && (
        <View style={styles.fatigueRow}>
          {item.fatigues.map((f) => (
            <View key={f} style={styles.fatigueChip}>
              <Text style={styles.fatigueChipText}>{f.charAt(0).toUpperCase() + f.slice(1)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
});

export default function HistoryScreen() {
  const { history, clearHistory } = useApp();

  const handleClear = useCallback(() => {
    const doClear = () => {
      if (Platform.OS !== 'web') {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }
      clearHistory();
    };

    if (Platform.OS === 'web') {
      if (confirm('Clear all history?')) {
        doClear();
      }
    } else {
      Alert.alert('Clear History', 'Remove all saved entries?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: doClear },
      ]);
    }
  }, [clearHistory]);

  const renderItem = useCallback(({ item }: { item: HistoryEntry }) => (
    <HistoryCard item={item} />
  ), []);

  const keyExtractor = useCallback((item: HistoryEntry) => item.id, []);

  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => b.timestamp - a.timestamp);
  }, [history]);

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
              <Trash2 size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {history.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Dumbbell size={36} color={Colors.textTertiary} strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyTitle}>No entries yet</Text>
            <Text style={styles.emptySubtitle}>
              Save a calculation from the calculator to start tracking your sessions.
            </Text>
          </View>
        ) : (
          <FlatList
            data={sortedHistory}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surface,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 8,
  },
  liftBadge: {
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.2)',
  },
  liftBadgeText: {
    fontSize: 10,
    fontWeight: '800' as const,
    letterSpacing: 1,
    color: Colors.accent,
  },
  liftName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    flex: 1,
  },
  cardTime: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: Colors.textTertiary,
  },
  cardBody: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 16,
  },
  weightBlock: {
    flexDirection: 'row' as const,
    alignItems: 'baseline' as const,
    gap: 4,
  },
  weightValue: {
    fontSize: 36,
    fontWeight: '200' as const,
    color: Colors.textPrimary,
    letterSpacing: -1.5,
  },
  weightUnit: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  metaBlock: {
    flex: 1,
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: '500' as const,
    color: Colors.textTertiary,
    letterSpacing: 0.3,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  penaltyPill: {
    backgroundColor: 'rgba(204, 255, 0, 0.08)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.15)',
  },
  penaltyText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.accent,
  },
  fatigueRow: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 6,
    paddingTop: 2,
  },
  fatigueChip: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  fatigueChipText: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.textTertiary,
    letterSpacing: 0.3,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingBottom: 80,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    fontSize: 13,
    fontWeight: '400' as const,
    color: Colors.textTertiary,
    textAlign: 'center' as const,
    lineHeight: 19,
  },
});
