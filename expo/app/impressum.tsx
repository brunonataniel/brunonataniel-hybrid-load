import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Building2 } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

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
          <Text style={styles.title}>IMPRINT / IMPRESSUM</Text>
        </View>

        <View style={styles.langLabel}>
          <Text style={styles.langLabelText}>ENGLISH</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionBody}>Bruno Nataniel Cuino Fernandes</Text>
          <Text style={styles.sectionBody}>Boberstrasse 4</Text>
          <Text style={styles.sectionBody}>22547 Hamburg</Text>
          <Text style={styles.sectionBody}>Germany</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionBody}>Email: support@hybridload.com</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionBody}>VAT identification number: DE365735815</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Online dispute resolution</Text>
          <Text style={styles.sectionBody}>
            The European Commission provides a platform for online dispute resolution (ODR), which can be found at{' '}
            <Text
              style={styles.link}
              onPress={() => Linking.openURL('https://ec.europa.eu/consumers/odr/')}
            >
              https://ec.europa.eu/consumers/odr/
            </Text>
            . We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.
          </Text>
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>
            English version for convenience; the German version below is legally binding.
          </Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.langLabel}>
          <Text style={styles.langLabelText}>DEUTSCH</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionBody}>Bruno Nataniel Cuino Fernandes</Text>
          <Text style={styles.sectionBody}>Boberstraße 4</Text>
          <Text style={styles.sectionBody}>22547 Hamburg</Text>
          <Text style={styles.sectionBody}>Deutschland</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionBody}>E-Mail: support@hybridload.com</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionBody}>Umsatzsteuer-Identifikationsnummer: DE365735815</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Online-Streitbeilegung</Text>
          <Text style={styles.sectionBody}>
            Die Europaische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie unter{' '}
            <Text
              style={styles.link}
              onPress={() => Linking.openURL('https://ec.europa.eu/consumers/odr/')}
            >
              https://ec.europa.eu/consumers/odr/
            </Text>
            {' '}finden. Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </Text>
        </View>

        <View style={styles.disclaimerSection}>
          <View style={styles.disclaimerLine} />
          <Text style={styles.disclaimerTextDe}>
            Rechtlicher Hinweis: Dieser Rechner dient ausschließlich Informations- und Trainingszwecken. Er stellt keine medizinische Diagnose oder Beratung dar.
          </Text>
          <Text style={styles.disclaimerTextEn}>
            Disclaimer: This calculator is for informational and training purposes only. It does not constitute medical diagnosis or advice.
          </Text>
        </View>
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
    fontSize: 26,
    fontWeight: '900' as const,
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 6,
  },
  langLabel: {
    marginBottom: 16,
  },
  langLabelText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.accent,
    letterSpacing: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sectionBody: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  link: {
    color: Colors.accent,
    textDecorationLine: 'underline' as const,
  },
  divider: {
    marginVertical: 32,
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: 'center' as const,
    lineHeight: 18,
    fontStyle: 'italic' as const,
    paddingHorizontal: 8,
  },
  disclaimerSection: {
    marginTop: 32,
    paddingTop: 24,
  },
  disclaimerLine: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 16,
  },
  disclaimerTextDe: {
    fontSize: 11,
    color: Colors.textTertiary,
    lineHeight: 17,
    marginBottom: 8,
  },
  disclaimerTextEn: {
    fontSize: 11,
    color: Colors.textTertiary,
    lineHeight: 17,
    opacity: 0.7,
  },
});
