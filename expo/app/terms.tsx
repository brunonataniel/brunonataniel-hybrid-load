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
import { ArrowLeft, FileText, AlertTriangle } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: `By downloading, installing, or using Hybrid Load ("the App"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the App.`,
  },
  {
    title: '2. Description of Service',
    body: `Hybrid Load is a barbell plate calculator with an integrated fatigue adjustment engine. The App helps users calculate plate configurations for desired weights and optionally adjusts target loads based on self-reported prior physical activity.`,
  },
  {
    title: '3. Medical & Fitness Disclaimer',
    body: `THIS IS THE MOST IMPORTANT SECTION.\n\nThe Fatigue Engine is a mathematical estimation tool. It applies percentage-based reductions to your target training load based on categories of prior activity you select. These reductions are generalized estimates and:\n\n• Are NOT personalized medical or fitness advice\n• Do NOT account for your individual fitness level, health conditions, injuries, age, or training experience\n• Should NOT replace the guidance of a certified personal trainer, strength coach, physician, or sports medicine professional\n• Are NOT validated clinical recommendations\n\nYou assume all risk associated with your use of the calculated weights. Always use proper form, appropriate safety equipment (clips, spotter, safety bars), and train within your known capabilities.\n\nIf you are new to resistance training, pregnant, recovering from injury, or have any medical condition, consult a qualified healthcare professional before using the App's fatigue adjustments.`,
  },
  {
    title: '4. Assumption of Risk',
    body: `Weightlifting and resistance training carry inherent risks of injury. By using Hybrid Load, you acknowledge that:\n\n• You are voluntarily participating in physical exercise\n• You are physically fit and have no medical condition that would prevent safe participation\n• You understand that the App provides mathematical calculations only\n• You will not hold Hybrid Load, its developers, or affiliates liable for any injury, loss, or damage resulting from your use of the App's calculations`,
  },
  {
    title: '5. Intellectual Property',
    body: `All content, features, design elements, and functionality of Hybrid Load are the property of the App's developers. The "Stealth Utility" design language, including the visual barbell system, fatigue engine UI, and plate calculation system, are proprietary.`,
  },
  {
    title: '6. User Conduct',
    body: `You agree to use the App only for its intended purpose as a fitness calculation tool. You may not:\n\n• Reverse engineer, decompile, or disassemble the App\n• Use the App for any unlawful purpose\n• Redistribute or commercially exploit the App's content`,
  },
  {
    title: '7. Limitation of Liability',
    body: `To the maximum extent permitted by law, Hybrid Load and its developers shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the App.\n\nThe App is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied.`,
  },
  {
    title: '8. Modifications',
    body: `We reserve the right to modify these Terms at any time. Continued use of the App following any changes constitutes your acceptance of the new Terms.`,
  },
  {
    title: '9. Governing Law',
    body: `These Terms shall be governed by and construed in accordance with applicable local laws, without regard to conflict of law principles.`,
  },
  {
    title: '10. Contact',
    body: `For questions regarding these Terms of Service, please contact us through the App's support channels.`,
  },
];

export default function TermsScreen() {
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
          testID="terms-back"
        >
          <ArrowLeft size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <FileText size={24} color={Colors.accent} />
          </View>
          <Text style={styles.title}>TERMS OF SERVICE</Text>
          <Text style={styles.subtitle}>Hybrid Load — Plate Calculator</Text>
          <Text style={styles.effectiveDate}>Effective: March 7, 2026</Text>
        </View>

        <View style={styles.disclaimerCard}>
          <View style={styles.disclaimerHeader}>
            <AlertTriangle size={18} color="#FF9500" />
            <Text style={styles.disclaimerTitle}>IMPORTANT DISCLAIMER</Text>
          </View>
          <Text style={styles.disclaimerBody}>
            The Hybrid Load Fatigue Engine is a mathematical estimation tool — not medical advice. All load adjustments are generalized calculations. Always consult a qualified fitness professional before modifying your training.
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
  disclaimerCard: {
    backgroundColor: 'rgba(255, 149, 0, 0.08)',
    borderRadius: 14,
    padding: 20,
    marginBottom: 36,
    borderWidth: 1,
    borderColor: 'rgba(255, 149, 0, 0.2)',
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  disclaimerTitle: {
    fontSize: 12,
    fontWeight: '800' as const,
    color: '#FF9500',
    letterSpacing: 1.5,
  },
  disclaimerBody: {
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
