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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionBody}>Bruno Nataniel Cuíno Fernandes</Text>
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
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie unter https://ec.europa.eu/consumers/odr/ finden. Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
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
    fontSize: 28,
    fontWeight: '900' as const,
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 6,
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
});
