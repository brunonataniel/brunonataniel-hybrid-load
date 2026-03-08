import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Lock, Zap, CheckCircle, X, Clock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Colors } from '@/constants/colors';
import { getSpotsRemaining, claimSpot, TOTAL_BETA_SPOTS } from '@/utils/spotsCounter';

interface ProGateModalProps {
  visible: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

export default React.memo(function ProGateModal({ visible, onClose, onUnlock }: ProGateModalProps) {
  const [email, setEmail] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const countAnim = useRef(new Animated.Value(1)).current;
  const queryClient = useQueryClient();

  const spotsQuery = useQuery({
    queryKey: ['beta-spots-remaining'],
    queryFn: getSpotsRemaining,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
    enabled: visible,
  });

  const spotsRemaining = spotsQuery.data ?? TOTAL_BETA_SPOTS;
  const isSoldOut = spotsRemaining <= 0;

  const claimMutation = useMutation({
    mutationFn: claimSpot,
    onSuccess: (data) => {
      console.log('[ProGate] Claim result:', data);
      queryClient.setQueryData(['beta-spots-remaining'], data.spotsRemaining);
    },
  });

  useEffect(() => {
    if (visible) {
      setSubmitted(false);
      setEmail('');
      setError('');
      fadeAnim.setValue(0);
      slideAnim.setValue(40);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, slideAnim]);

  useEffect(() => {
    if (visible && !submitted && !isSoldOut) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 900, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [visible, submitted, pulseAnim, isSoldOut]);

  const animateCountChange = useCallback(() => {
    Animated.sequence([
      Animated.timing(countAnim, { toValue: 0.6, duration: 120, useNativeDriver: true }),
      Animated.timing(countAnim, { toValue: 1.1, duration: 150, useNativeDriver: true }),
      Animated.timing(countAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  }, [countAnim]);

  const validateEmail = useCallback((text: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!email.trim()) {
      setError('Email required');
      return;
    }
    if (!validateEmail(email.trim())) {
      setError('Enter a valid email');
      return;
    }

    if (isSoldOut) {
      return;
    }

    if (Platform.OS !== 'web') {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    setError('');

    try {
      const result = await claimMutation.mutateAsync();
      animateCountChange();

      if (result.success) {
        setSubmitted(true);
        successScale.setValue(0);
        Animated.spring(successScale, {
          toValue: 1,
          friction: 4,
          tension: 80,
          useNativeDriver: true,
        }).start();

        setTimeout(() => {
          onUnlock();
        }, 2200);
      } else {
        setError('All spots have been claimed.');
      }
    } catch (err) {
      console.log('[ProGate] Claim error:', err);
      setSubmitted(true);
      successScale.setValue(0);
      Animated.spring(successScale, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        onUnlock();
      }, 2200);
    }
  }, [email, validateEmail, onUnlock, successScale, isSoldOut, claimMutation, animateCountChange]);

  const handleClose = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 40,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  }, [fadeAnim, slideAnim, onClose]);

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Pressable style={styles.overlayPress} onPress={handleClose} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
        >
          <Animated.View
            style={[
              styles.modal,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={handleClose}
              activeOpacity={0.6}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <X size={18} color={Colors.textTertiary} />
            </TouchableOpacity>

            {!submitted ? (
              <>
                <Animated.View style={[
                  styles.iconContainer,
                  isSoldOut ? styles.iconContainerSoldOut : undefined,
                  { transform: [{ scale: isSoldOut ? 1 : pulseAnim }] },
                ]}>
                  {isSoldOut ? (
                    <Clock size={24} color="#71717A" strokeWidth={2.5} />
                  ) : (
                    <Lock size={24} color="#0D0D0D" strokeWidth={2.5} />
                  )}
                </Animated.View>

                <View style={styles.statusRow}>
                  <View style={[styles.statusDot, isSoldOut && styles.statusDotSoldOut]} />
                  <Text style={[styles.statusText, isSoldOut && styles.statusTextSoldOut]}>
                    {isSoldOut ? 'BETA PASSES EXHAUSTED' : 'BETA PHASE ACTIVE'}
                  </Text>
                </View>

                <Text style={styles.headline}>
                  {isSoldOut ? 'ALL PASSES\nCLAIMED' : 'UNLOCK MULTI-ENGINE\nLOGIC'}
                </Text>

                <Text style={styles.subtext}>
                  {isSoldOut
                    ? 'All 50 Lifetime Pro passes have been claimed. Join the waitlist to be notified when new spots open up.'
                    : (
                      <>
                        Stacking multiple fatigue sources (e.g., Combat + HIIT) is a Pro feature. During our Beta Phase, we are granting{' '}
                        <Text style={styles.subtextHighlight}>Lifetime Pro Access</Text> to the first 50 testers who provide feedback.
                      </>
                    )
                  }
                </Text>

                <View style={styles.statsRow}>
                  <View style={styles.statBlock}>
                    <Animated.View style={{ transform: [{ scale: countAnim }] }}>
                      {spotsQuery.isLoading ? (
                        <ActivityIndicator size="small" color={Colors.textPrimary} />
                      ) : (
                        <Text style={[styles.statValue, isSoldOut && styles.statValueSoldOut]}>
                          {spotsRemaining}
                        </Text>
                      )}
                    </Animated.View>
                    <Text style={styles.statLabel}>{isSoldOut ? 'CLAIMED' : 'SPOTS LEFT'}</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statBlock}>
                    <Text style={styles.statValue}>∞</Text>
                    <Text style={styles.statLabel}>LIFETIME</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statBlock}>
                    <Text style={styles.statValue}>5+</Text>
                    <Text style={styles.statLabel}>ENGINES</Text>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <TextInput
                    testID="pro-email-input"
                    style={[styles.emailInput, error ? styles.emailInputError : null]}
                    value={email}
                    onChangeText={(t) => { setEmail(t); setError(''); }}
                    placeholder="your@email.com"
                    placeholderTextColor={Colors.textTertiary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    selectionColor={Colors.accent}
                    returnKeyType="go"
                    onSubmitEditing={handleSubmit}
                  />
                  {error ? <Text style={styles.errorText}>{error}</Text> : null}
                </View>

                <TouchableOpacity
                  testID="claim-pass-button"
                  style={[styles.claimButton, isSoldOut && styles.claimButtonSoldOut]}
                  onPress={handleSubmit}
                  activeOpacity={0.8}
                  disabled={claimMutation.isPending}
                >
                  {claimMutation.isPending ? (
                    <ActivityIndicator size="small" color={isSoldOut ? '#A1A1AA' : '#0D0D0D'} />
                  ) : isSoldOut ? (
                    <>
                      <Clock size={16} color="#A1A1AA" strokeWidth={2.5} />
                      <Text style={styles.claimButtonTextSoldOut}>JOIN THE WAITLIST</Text>
                    </>
                  ) : (
                    <>
                      <Zap size={16} color="#0D0D0D" strokeWidth={2.5} />
                      <Text style={styles.claimButtonText}>CLAIM MY LIFETIME PASS</Text>
                    </>
                  )}
                </TouchableOpacity>

                <Text style={styles.disclaimer}>No spam. Used only for beta coordination.</Text>

                <Text style={styles.legalDisclaimer}>
                  Offer limited to the first 50 unique beta testers. Real-time count based on database timestamps.
                </Text>
              </>
            ) : (
              <Animated.View style={[styles.successContainer, { transform: [{ scale: successScale }] }]}>
                <View style={styles.successIcon}>
                  <CheckCircle size={40} color={Colors.accent} strokeWidth={2} />
                </View>
                <Text style={styles.successHeadline}>ACCESS GRANTED</Text>
                <Text style={styles.successSub}>Welcome to the Founder's Circle.</Text>
                <View style={styles.successBadge}>
                  <Text style={styles.successBadgeText}>MULTI-ENGINE UNLOCKED</Text>
                </View>
              </Animated.View>
            )}
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayPress: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modal: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#0A0A0A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#27272A',
    padding: 28,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconContainerSoldOut: {
    backgroundColor: '#27272A',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  statusDotSoldOut: {
    backgroundColor: '#EF4444',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 1.5,
    color: Colors.accent,
    opacity: 0.9,
  },
  statusTextSoldOut: {
    color: '#EF4444',
  },
  headline: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: Colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.3,
    lineHeight: 28,
    marginBottom: 12,
  },
  subtext: {
    fontSize: 13,
    lineHeight: 20,
    color: '#A1A1AA',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtextHighlight: {
    color: Colors.accent,
    fontWeight: '700' as const,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
    width: '100%',
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.textPrimary,
  },
  statValueSoldOut: {
    color: '#EF4444',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '600' as const,
    letterSpacing: 1,
    color: Colors.textTertiary,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  inputGroup: {
    width: '100%',
    marginBottom: 12,
  },
  emailInput: {
    width: '100%',
    backgroundColor: '#18181B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272A',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.textPrimary,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {}),
  },
  emailInputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 11,
    color: '#EF4444',
    marginTop: 6,
    marginLeft: 4,
  },
  claimButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 12,
  },
  claimButtonSoldOut: {
    backgroundColor: '#27272A',
    borderWidth: 1,
    borderColor: '#3F3F46',
  },
  claimButtonText: {
    fontSize: 14,
    fontWeight: '800' as const,
    color: '#0D0D0D',
    letterSpacing: 0.8,
  },
  claimButtonTextSoldOut: {
    fontSize: 14,
    fontWeight: '800' as const,
    color: '#A1A1AA',
    letterSpacing: 0.8,
  },
  disclaimer: {
    fontSize: 11,
    color: Colors.textTertiary,
    opacity: 0.7,
  },
  legalDisclaimer: {
    fontSize: 9,
    color: Colors.textTertiary,
    opacity: 0.5,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 13,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(204, 255, 0, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  successHeadline: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.accent,
    letterSpacing: 1,
  },
  successSub: {
    fontSize: 14,
    color: '#A1A1AA',
    textAlign: 'center',
  },
  successBadge: {
    marginTop: 8,
    backgroundColor: 'rgba(204, 255, 0, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  successBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 1.2,
    color: Colors.accent,
  },
});
