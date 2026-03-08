import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  TextInput,
  ActivityIndicator,
  Linking,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Swords, Zap, Activity, Waves, Footprints, ChevronRight, Shield, Building2, Mail, Brain, RefreshCw, ShieldCheck } from 'lucide-react-native';
import { useWindowDimensions } from 'react-native';
import { Colors } from '@/constants/colors';

const VALUE_PROPS = [
  {
    icon: Brain,
    title: 'LOCAL VS. SYSTEMIC LOGIC',
    description: "We don't punish your Bench for your Run. HybridLoad separates CNS drain from local muscular fatigue — so upper body lifts only feel what actually affects them.",
  },
  {
    icon: RefreshCw,
    title: 'INSTANT RECALIBRATION',
    description: 'Switch between Squat, Bench, Deadlift, and OHP — watch your suggested load update in real-time as the engine rescales fatigue to your specific lift.',
  },
  {
    icon: ShieldCheck,
    title: 'PERFORMANCE OPTIMIZATION',
    description: 'Maximize every session by training at the correct intensity. The engine acts as a digital coach, ensuring you push your limits without hitting a wall.',
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: 'HIIT',
    subtitle: 'Sprints',
    reductionRange: '-6% to -20%',
    description: 'Accounts for CNS fatigue from high-intensity work',
  },
  {
    icon: Swords,
    title: 'COMBAT',
    subtitle: 'BJJ / MMA / Full-Body Contact',
    reductionRange: '-9% to -15%',
    description: 'Auto-adjusts load after grappling sessions',
  },
  {
    icon: Activity,
    title: 'RUNNING',
    subtitle: 'Endurance / Zone 2',
    reductionRange: '-3% to -10%',
    description: 'Factors in lower body fatigue from distance runs',
  },
  {
    icon: Footprints,
    title: 'STAIRS',
    subtitle: 'Stairmaster',
    reductionRange: '-3% to -10%',
    description: 'Compensates for quad and glute pre-fatigue',
  },
  {
    icon: Waves,
    title: 'SWIM',
    subtitle: 'Laps',
    reductionRange: '-3% to -10%',
    description: 'Minimal impact on lifting — smart micro-adjustment',
  },
];

export default function LandingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState<string>('');
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const { width: windowWidth } = useWindowDimensions();
  const isWideScreen = windowWidth >= 560;

  const heroAnim = useRef(new Animated.Value(0)).current;
  const valueAnims = useRef(VALUE_PROPS.map(() => new Animated.Value(0))).current;
  const featureAnims = useRef(FEATURES.map(() => new Animated.Value(0))).current;
  const ctaAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(heroAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    VALUE_PROPS.forEach((_, i) => {
      Animated.timing(valueAnims[i], {
        toValue: 1,
        duration: 500,
        delay: 300 + i * 100,
        useNativeDriver: true,
      }).start();
    });

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
  }, [heroAnim, valueAnims, featureAnims, ctaAnim]);

  const handleClaim = useCallback(async () => {
    if (!email.trim() || submitState === 'loading') return;

    console.log('[Landing] Submitting email to Formspree:', email);
    setSubmitState('loading');

    try {
      const response = await fetch('https://formspree.io/f/mojkvdez', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (response.ok) {
        console.log('[Landing] Formspree submission success');
        setSubmitState('success');
        setEmail('');
      } else {
        console.log('[Landing] Formspree submission failed:', response.status);
        setSubmitState('error');
      }
    } catch (err) {
      console.log('[Landing] Formspree submission error:', err);
      setSubmitState('error');
    }
  }, [email, submitState]);

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
          <View style={styles.logoRow}>
            <Image
              source={{ uri: 'https://r2-pub.rork.com/generated-images/ad7cd1ad-6a31-4577-b3a6-dd32ceddc30d.png' }}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.logoTextWrap}>
              <Text style={styles.logoTextHybrid}>HYBRID</Text>
              <Text style={styles.logoTextLoad}>LOAD</Text>
            </View>
          </View>

          <Text style={styles.heroHeadline}>
            THE FATIGUE{'\n'}ENGINE BUILT{'\n'}FOR <Text style={styles.heroAccent}>SPECIFICITY.</Text>
          </Text>

          <Text style={styles.heroSubtext}>
            Stop guessing your recovery. HybridLoad scales fatigue based on your specific lift — separating CNS drain from local muscular fatigue. High-performance math for the hybrid athlete.
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

        <View style={styles.valueSectionHeader}>
          <View style={styles.sectionLine} />
          <Text style={styles.sectionTitle}>WHY HYBRID LOAD?</Text>
          <View style={styles.sectionLine} />
        </View>

        <View style={[styles.valueGrid, isWideScreen && styles.valueGridWide]}>
          {VALUE_PROPS.map((prop, index) => {
            const Icon = prop.icon;
            return (
              <Animated.View
                key={prop.title}
                style={[
                  styles.valueCard,
                  isWideScreen && styles.valueCardWide,
                  {
                    opacity: valueAnims[index],
                    transform: [
                      {
                        translateY: valueAnims[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.valueIconWrap}>
                  <Icon size={22} color={Colors.accent} />
                </View>
                <Text style={styles.valueTitle}>{prop.title}</Text>
                <Text style={styles.valueDesc}>{prop.description}</Text>
              </Animated.View>
            );
          })}
        </View>

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
                    <Text style={styles.reductionText}>{feature.reductionRange}</Text>
                  </View>
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
                <Text style={styles.featureDesc}>{feature.description}</Text>
              </Animated.View>
            );
          })}
        </View>

        <Text style={styles.featureGridCaption}>Scales based on Upper vs. Lower body lifts.</Text>

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

        <View style={styles.waitlistSection}>
          <View style={styles.waitlistHeader}>
            <View style={styles.waitlistLine} />
            <Text style={styles.waitlistLabel}>BETA WAITLIST</Text>
            <View style={styles.waitlistLine} />
          </View>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.emailInput}
              placeholder="deine@email.de"
              placeholderTextColor={Colors.textTertiary}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (submitState === 'success' || submitState === 'error') {
                  setSubmitState('idle');
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={submitState !== 'loading'}
              testID="waitlist-email-input"
            />
            <TouchableOpacity
              style={[
                styles.claimButton,
                submitState === 'loading' && styles.claimButtonDisabled,
              ]}
              activeOpacity={0.8}
              onPress={handleClaim}
              disabled={submitState === 'loading' || !email.trim()}
              testID="waitlist-claim-button"
            >
              {submitState === 'loading' ? (
                <ActivityIndicator size="small" color="#000000" />
              ) : (
                <Text style={styles.claimButtonText}>CLAIM</Text>
              )}
            </TouchableOpacity>
          </View>

          {submitState === 'success' && (
            <Text style={styles.successMessage}>Erfolgreich eingetragen!</Text>
          )}
          {submitState === 'error' && (
            <Text style={styles.errorMessage}>Fehler. Bitte versuche es später erneut.</Text>
          )}

          <Text style={styles.consentText}>
            Durch Klick auf den Button stimmst du unserer{' '}
            <Text
              style={styles.consentLink}
              onPress={() => router.push('/privacy')}
            >
              Datenschutzerklärung
            </Text>{' '}
            zu.
          </Text>
        </View>

        <View style={styles.legalRow}>
          <TouchableOpacity onPress={() => router.push('/impressum')} testID="landing-impressum">
            <View style={styles.legalLink}>
              <Building2 size={14} color={Colors.textTertiary} />
              <Text style={styles.legalText}>Imprint / Impressum</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.legalDot} />
          <TouchableOpacity onPress={() => router.push('/privacy')} testID="landing-privacy">
            <View style={styles.legalLink}>
              <Shield size={14} color={Colors.textTertiary} />
              <Text style={styles.legalText}>Privacy Policy / Datenschutz</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('mailto:support@hybridload.com')}>
          <Mail size={13} color={Colors.textTertiary} />
          <Text style={styles.contactText}>support@hybridload.com</Text>
        </TouchableOpacity>

        <View style={styles.disclaimerWrap}>
          <Text style={styles.disclaimerText}>
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
  heroSection: {
    marginBottom: 48,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
  },
  headerLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  logoTextWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  logoTextHybrid: {
    fontSize: 18,
    fontWeight: '900' as const,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  logoTextLoad: {
    fontSize: 18,
    fontWeight: '900' as const,
    color: Colors.accent,
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
  valueSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  valueGrid: {
    gap: 12,
    marginBottom: 40,
  },
  valueGridWide: {
    flexDirection: 'row',
    gap: 10,
  },
  valueCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#27272a',
    borderTopWidth: 2,
    borderTopColor: 'rgba(204, 255, 0, 0.25)',
  },
  valueCardWide: {
    flex: 1,
  },
  valueIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  valueTitle: {
    fontSize: 13,
    fontWeight: '800' as const,
    color: Colors.accent,
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  valueDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
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
    marginBottom: 12,
  },
  featureGridCaption: {
    fontSize: 12,
    color: Colors.textTertiary,
    textAlign: 'center' as const,
    fontStyle: 'italic' as const,
    lineHeight: 18,
    marginBottom: 48,
    opacity: 0.7,
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
  betaBadge: {
    marginTop: 14,
    backgroundColor: 'rgba(204, 255, 0, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.12)',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  betaBadgeText: {
    fontSize: 11,
    color: Colors.textTertiary,
    textAlign: 'center' as const,
    fontWeight: '500' as const,
    letterSpacing: 0.3,
    lineHeight: 16,
  },
  waitlistSection: {
    marginBottom: 40,
  },
  waitlistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  waitlistLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  waitlistLabel: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.textTertiary,
    letterSpacing: 1.1,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  emailInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  claimButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
  },
  claimButtonDisabled: {
    opacity: 0.7,
  },
  claimButtonText: {
    fontSize: 14,
    fontWeight: '800' as const,
    color: '#000000',
    letterSpacing: 1.2,
  },
  successMessage: {
    fontSize: 13,
    color: '#4ADE80',
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 13,
    color: '#F87171',
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  consentText: {
    fontSize: 11,
    color: Colors.textTertiary,
    lineHeight: 16,
    marginTop: 4,
  },
  consentLink: {
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
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
  disclaimerWrap: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.04)',
  },
  disclaimerText: {
    fontSize: 10,
    color: Colors.textTertiary,
    lineHeight: 15,
    textAlign: 'center' as const,
    opacity: 0.6,
    marginBottom: 6,
  },
  disclaimerTextEn: {
    fontSize: 10,
    color: Colors.textTertiary,
    lineHeight: 15,
    textAlign: 'center' as const,
    opacity: 0.45,
  },
});
