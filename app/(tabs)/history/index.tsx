import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lock, Bell } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import ProUnlockModal from '@/components/ProUnlockModal';

export default function HistoryScreen() {
  const [showProModal, setShowProModal] = useState<boolean>(false);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
        </View>

        <View style={styles.lockedContainer}>
          <View style={styles.lockIconWrap}>
            <Lock size={36} color={Colors.accent} strokeWidth={1.5} />
          </View>
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>PRO</Text>
          </View>
          <Text style={styles.lockedTitle}>Track every session. See your training patterns.</Text>
          <Text style={styles.comingSoonText}>Coming soon</Text>
          <TouchableOpacity
            testID="notify-pro-history"
            style={styles.notifyButton}
            onPress={() => setShowProModal(true)}
            activeOpacity={0.8}
          >
            <Bell size={14} color="#0D0D0D" strokeWidth={2.5} />
            <Text style={styles.notifyButtonText}>NOTIFY ME</Text>
          </TouchableOpacity>
          <ProUnlockModal visible={showProModal} onClose={() => setShowProModal(false)} />
        </View>
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
  lockedContainer: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingBottom: 80,
    paddingHorizontal: 32,
    gap: 14,
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
  proBadge: {
    backgroundColor: 'rgba(204, 255, 0, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.25)',
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginTop: 4,
  },
  proBadgeText: {
    fontSize: 12,
    fontWeight: '800' as const,
    letterSpacing: 1.5,
    color: Colors.accent,
  },
  lockedTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.textPrimary,
    textAlign: 'center' as const,
    lineHeight: 23,
  },
  comingSoonText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.textTertiary,
    letterSpacing: 0.3,
  },
  notifyButton: {
    flexDirection: 'row' as const,
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 36,
    alignItems: 'center' as const,
    gap: 8,
    marginTop: 4,
  },
  notifyButtonText: {
    fontSize: 13,
    fontWeight: '800' as const,
    letterSpacing: 1.5,
    color: '#0D0D0D',
  },
});
