import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Shield } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: `Hybrid Load is designed with privacy at its core. The app operates primarily on your device.\n\nThe data we handle includes:\n• Your calculation history (stored locally on your device)\n• Your app preferences and settings (stored locally on your device)\n• Your email address (collected only if you sign up for Pro features or participate in beta testing)\n\nWe do not collect names, location data, health data, or any other personally identifiable information beyond your email for authentication purposes.`,
  },
  {
    title: '2. How We Use Information',
    body: `Your calculation history is stored locally to provide you with a convenient reference of past calculations. This data is never transmitted to our servers or any third party.\n\nIf you opt into Pro features or the Founder's Beta program, your email address is collected solely for authentication and beta-testing communication. We will never sell, rent, or share your email with third parties for marketing purposes.`,
  },
  {
    title: '3. Data Storage & Security',
    body: `All app data is stored locally on your device using standard platform storage mechanisms. We do not maintain any external databases containing user data. When you delete the app, all locally stored data is permanently removed.`,
  },
  {
    title: '4. Third-Party Services',
    body: `Hybrid Load does not integrate with any third-party analytics, advertising, or tracking services. We do not share any data with third parties because we do not collect any data to share.`,
  },
  {
    title: '5. Fitness & Health Disclaimer',
    body: `The fatigue adjustment calculations provided by Hybrid Load are mathematical estimates based on general exercise science principles. They are not medical advice and should not be used as a substitute for professional guidance from a certified personal trainer, physician, or sports medicine specialist.\n\nAlways consult a qualified professional before making changes to your training program.`,
  },
  {
    title: '6. Children\'s Privacy',
    body: `Hybrid Load is not directed at children under the age of 13. We do not knowingly collect any information from children. The app is intended for use by adults engaged in resistance training.`,
  },
  {
    title: '7. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time. Any changes will be reflected within the app. Your continued use of Hybrid Load after changes are posted constitutes your acceptance of the updated policy.`,
  },
  {
    title: '8. Contact',
    body: `If you have any questions about this Privacy Policy, please reach out through the app's support channels.`,
  },
];

export default function PrivacyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          testID="privacy-back"
        >
          <ArrowLeft size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Shield size={24} color={Colors.accent} />
          </View>
          <Text style={styles.title}>PRIVACY POLICY</Text>
          <Text style={styles.subtitle}>Hybrid Load — Plate Calculator</Text>
          <Text style={styles.effectiveDate}>Effective: March 7, 2026</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>TL;DR</Text>
          <Text style={styles.summaryBody}>
            Hybrid Load stores calculation data locally on your device. Emails are only collected for authentication and beta-testing purposes. No tracking. No ads.
          </Text>
        </View>

        {SECTIONS.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  header: {
    marginBottom: 32,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '900' as const,
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
    marginBottom: 4,
  },
  effectiveDate: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  summaryCard: {
    backgroundColor: Colors.accentDim,
    borderRadius: 14,
    padding: 20,
    marginBottom: 36,
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.15)',
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '800' as const,
    color: Colors.accent,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  summaryBody: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  sectionBody: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
