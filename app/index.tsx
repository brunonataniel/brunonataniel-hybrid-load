import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Swords, Zap, Activity, Waves, Footprints, ChevronRight, Shield, FileText, Mail, Building2 } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

const FEATURES = [
  {
    icon: Swords,
    title: 'COMBAT',
    subtitle: 'BJJ / MMA',
    reduction: '15%',
    description: 'Auto-adjusts load after grappling sessions',
  },
  {
    icon: Zap,
    title: 'HIIT',
    subtitle: 'Sprints',
    reduction: '20%',
    description: 'Accounts for CNS fatigue from high-intensity work',
  },
  {
    icon: Activity,
    title: 'RUNNING',
    subtitle: 'Cardio',
    reduction: '12%',
    description: 'Factors in lower body fatigue from distance runs',
  },
  {
    icon: Footprints,
    title: 'STAIRS',
    subtitle: 'Stairmaster',
    reduction: '10%',
    description: 'Compensates for quad and glute pre-fatigue',
  },
  {
    icon: Waves,
    title: 'SWIM',
    subtitle: 'Laps',
    reduction: '5%',
    description: 'Minimal impact on lifting — smart micro-adjustment',
  },
];

export default function LandingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const heroAnim = useRef(new Animated.Value(0)).current;
  const featureAnims = useRef(FEATURES.map(() => new Animated.Value(0))).current;
  const ctaAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(heroAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    FEATURES.forEach((_, i) => {
      Animated.timing(featureAnims[i], {
        toValue: 1,
        duration: 500,
        delay: 400 + i * 120,
        useNativeDriver: true,
      }).start();
    });

    Animated.timing(ctaAnim, {
      toValue: 1,
      duration: 600,
      delay: 1000,
      useNativeDriver: true,
    }).start();
  }, [heroAnim, featureAnims, ctaAnim]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.heroSection,
            {
              opacity: heroAnim,
              transform: [{ translateY: heroAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }],
            },
          ]}
        >
          <View style={styles.badge}>
            <Text style={styles.badgeText}>HYBRID LOAD</Text>
          </View>

          <Text style={styles.heroHeadline}>
            HYBRID{'\n'}FATIGUE{'\n'}IS <Text style={styles.heroAccent}>REAL.</Text>
          </Text>

          <Text style={styles.heroSubtext}>
            The gym math is over.{'\n'}
            Plate calculator with a built-in fatigue engine.{'\n'}
            Train smarter after combat, cardio, or HIIT.
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>FATIGUE{'\n'}INPUTS</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>45%</Text>
              <Text style={styles.statLabel}>MAX{'\n'}IMPACT</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>∞</Text>
              <Text style={styles.statLabel}>CNS{'\n'}DIAGNOSTIC</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionLine} />
          <Text style={styles.sectionTitle}>UNIVERSAL FATIGUE ENGINE</Text>
          <View style={styles.sectionLine} />
        </View>

        <View style={styles.featureGrid}>
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Animated.View
                key={feature.title}
                style={[
                  styles.featureCard,
                  {
                    opacity: featureAnims[index],
                    transform: [
                      {
                        translateY: featureAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [24, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.featureIconRow}>
                  <View style={styles.featureIconWrap}>
                    <Icon size={20} color={Colors.accent} />
                  </View>
                  <View style={styles.reductionBadge}>
                    <Text style={styles.reductionText}>-{feature.reduction}</Text>
                  </View>
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
                <Text style={styles.featureDesc}>{feature.description}</Text>
              </Animated.View>
            );
          })}
        </View>

        <Animated.View
          style={[
            styles.ctaSection,
            {
              opacity: ctaAnim,
              transform: [{ translateY: ctaAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.ctaButton}
            activeOpacity={0.85}
            onPress={() => router.push('/(tabs)/calculator')}
            testID="landing-cta"
          >
            <Text style={styles.ctaText}>OPEN CALCULATOR</Text>
            <ChevronRight size={18} color="#000000" />
          </TouchableOpacity>

          <Text style={styles.ctaNote}>Privacy First. Accounts only required for Pro Features.</Text>
        </Animated.View>

        <View style={styles.legalRow}>
          <TouchableOpacity onPress={() => router.push('/impressum')} testID="landing-impressum">
            <View style={styles.legalLink}>
              <Building2 size={14} color={Colors.textTertiary} />
              <Text style={styles.legalText}>Impressum</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.legalDot} />
          <TouchableOpacity onPress={() => router.push('/privacy')} testID="landing-privacy">
            <View style={styles.legalLink}>
              <Shield size={14} color={Colors.textTertiary} />
              <Text style={styles.legalText}>Privacy</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.legalDot} />
          <TouchableOpacity onPress={() => router.push('/terms')} testID="landing-terms">
            <View style={styles.legalLink}>
              <FileText size={14} color={Colors.textTertiary} />
              <Text style={styles.legalText}>Terms</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.contactRow}>
          <Mail size={13} color={Colors.textTertiary} />
          <Text style={styles.contactText}>support@hybridload.com</Text>
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
  heroSection: {
    marginBottom: 48,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentMuted,
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.25)',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 24,
  },
  badgeText: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 2,
  },
  heroHeadline: {
    fontSize: 52,
    fontWeight: '900' as const,
    color: '#FFFFFF',
    lineHeight: 56,
    letterSpacing: -1.5,
    marginBottom: 20,
  },
  heroAccent: {
    color: Colors.accent,
  },
  heroSubtext: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.accent,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600' as const,
    color: Colors.textTertiary,
    letterSpacing: 1,
    textAlign: 'center',
    lineHeight: 14,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.textTertiary,
    letterSpacing: 0.1 * 11,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  featureGrid: {
    gap: 12,
    marginBottom: 48,
  },
  featureCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  featureIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  featureIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reductionBadge: {
    backgroundColor: '#CCFF00',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  reductionText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '900' as const,
    letterSpacing: 0.5,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 2,
  },
  featureSubtitle: {
    fontSize: 13,
    color: Colors.textTertiary,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  featureDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  ctaSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    gap: 8,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '800' as const,
    color: '#000000',
    letterSpacing: 1.5,
  },
  ctaNote: {
    marginTop: 12,
    fontSize: 12,
    color: Colors.textTertiary,
  },
  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  legalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legalText: {
    fontSize: 13,
    color: Colors.textTertiary,
    fontWeight: '500' as const,
  },
  legalDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textTertiary,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
  },
  contactText: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: '500' as const,
  },
});
