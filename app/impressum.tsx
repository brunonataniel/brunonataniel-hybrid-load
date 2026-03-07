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
import { ArrowLeft, Building2 } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

const SECTIONS = [
  {
    title: '1. Service Provider',
    body: `Hybrid Load\nA fitness technology product.\n\nEmail: support@hybridload.com\nWebsite: https://hybridload.com`,
  },
  {
    title: '2. Responsible for Content',
    body: `The operator of this application is responsible for the content provided within the app, in accordance with applicable regulations.\n\nAll editorial content, fatigue engine logic, and plate calculation algorithms are developed and maintained by the Hybrid Load team.`,
  },
  {
    title: '3. Liability for Content',
    body: `The contents of this application have been created with the utmost care. However, we cannot guarantee the accuracy, completeness, or timeliness of the content.\n\nAs a service provider, we are responsible for our own content within this app. However, we are not obligated to monitor transmitted or stored third-party information, or to investigate circumstances that indicate illegal activity.`,
  },
  {
    title: '4. Liability for Links',
    body: `Our app may contain links to external websites of third parties over whose content we have no influence. Therefore, we cannot accept any liability for this third-party content.\n\nThe respective provider or operator of the linked pages is always responsible for their content.`,
  },
  {
    title: '5. Intellectual Property',
    body: `The content and works created by the app operators are subject to applicable copyright law. Duplication, processing, distribution, or any form of commercialization of such material beyond the scope of copyright law requires the prior written consent of the respective author or creator.\n\nThe "Stealth Utility" design language, Universal Fatigue Engine, and all associated visual and functional elements are proprietary to Hybrid Load.`,
  },
  {
    title: '6. Data Protection',
    body: `Use of this application is generally possible without providing personal data. Where personal data (such as email addresses) is collected, this is done on a voluntary basis.\n\nFor full details, please refer to our Privacy Policy accessible within the app.`,
  },
  {
    title: '7. Dispute Resolution',
    body: `The European Commission provides a platform for online dispute resolution (OS): https://ec.europa.eu/consumers/odr\n\nWe are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.`,
  },
];

export default function ImpressumScreen() {
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
          testID="impressum-back"
        >
          <ArrowLeft size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Building2 size={24} color={Colors.accent} />
          </View>
          <Text style={styles.title}>IMPRESSUM</Text>
          <Text style={styles.subtitle}>Hybrid Load — Legal Notice</Text>
          <Text style={styles.effectiveDate}>Effective: March 7, 2026</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>LEGAL DISCLOSURE</Text>
          <Text style={styles.summaryBody}>
            Information in accordance with legal requirements for digital service providers. This page identifies the responsible party behind Hybrid Load.
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
