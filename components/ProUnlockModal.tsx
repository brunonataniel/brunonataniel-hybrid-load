import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { X, Bell } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';

interface ProNotifyModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ProUnlockModal({ visible, onClose }: ProNotifyModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleShow = useCallback(() => {
    setConfirmed(false);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleSubmit = useCallback(async () => {
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    if (Platform.OS !== 'web') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      console.log('[ProNotify] Email captured:', trimmed);
      setEmail('');
      setConfirmed(true);
      setTimeout(() => {
        onClose();
        setTimeout(() => setConfirmed(false), 300);
      }, 2200);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [email, onClose]);

  const handleClose = useCallback(() => {
    setError('');
    setConfirmed(false);
    onClose();
  }, [onClose]);

  return (
    <Modal
      transparent
      animationType="none"
      visible={visible}
      onRequestClose={handleClose}
      onShow={handleShow}
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.card}>
              <TouchableOpacity
                testID="pro-modal-close"
                style={styles.closeButton}
                onPress={handleClose}
                activeOpacity={0.6}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <X size={18} color={Colors.textSecondary} />
              </TouchableOpacity>

              {confirmed ? (
                <View style={styles.confirmWrap}>
                  <View style={styles.confirmIconWrap}>
                    <Bell size={24} color={Colors.accent} strokeWidth={2} />
                  </View>
                  <Text style={styles.confirmText}>
                    You're on the list. We'll let you know when Pro goes live.
                  </Text>
                </View>
              ) : (
                <>
                  <View style={styles.bellIconWrap}>
                    <Bell size={24} color={Colors.accent} strokeWidth={2} />
                  </View>

                  <Text style={styles.header}>PRO IS COMING</Text>
                  <Text style={styles.description}>
                    Be the first to know when Pro goes live. Get access to the plate visualizer, training history, and more.
                  </Text>

                  <View style={styles.inputWrap}>
                    <TextInput
                      testID="pro-email-input"
                      style={styles.input}
                      value={email}
                      onChangeText={(t) => { setEmail(t); setError(''); }}
                      placeholder="your@email.com"
                      placeholderTextColor={Colors.textTertiary}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      selectionColor={Colors.accent}
                      editable={!isSubmitting}
                      {...(Platform.OS === 'web' ? { outlineStyle: 'none' as any } : {})}
                    />
                  </View>

                  {error.length > 0 && (
                    <Text style={styles.errorText}>{error}</Text>
                  )}

                  <TouchableOpacity
                    testID="pro-submit-button"
                    style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    activeOpacity={0.8}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator size="small" color="#0D0D0D" />
                    ) : (
                      <Text style={styles.submitText}>NOTIFY ME</Text>
                    )}
                  </TouchableOpacity>

                  <Text style={styles.consent}>
                    By clicking 'Notify Me', you agree to our{' '}
                    <Text style={styles.consentLink} onPress={() => { handleClose(); router.push('/privacy'); }}>
                      Privacy Policy (EN/DE)
                    </Text>
                    . / Mit Klick auf 'Notify Me' stimmst du unserer{' '}
                    <Text style={styles.consentLink} onPress={() => { handleClose(); router.push('/privacy'); }}>
                      Datenschutzerklärung
                    </Text>
                    {' '}zu.
                  </Text>
                </>
              )}
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  container: {
    width: '100%',
    maxWidth: 380,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(204, 255, 0, 0.2)',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: 'center',
    shadowColor: '#CCFF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(204, 255, 0, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.15)',
  },
  header: {
    fontSize: 14,
    fontWeight: '800' as const,
    letterSpacing: 1.8,
    color: Colors.accent,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputWrap: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 6,
  },
  input: {
    fontSize: 16,
    color: Colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  errorText: {
    fontSize: 12,
    color: '#FF453A',
    marginBottom: 6,
    textAlign: 'center',
  },
  submitButton: {
    width: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 14,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitText: {
    fontSize: 14,
    fontWeight: '800' as const,
    letterSpacing: 1.5,
    color: '#0D0D0D',
  },
  consent: {
    fontSize: 10,
    lineHeight: 15,
    color: Colors.textTertiary,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  consentLink: {
    color: Colors.accent,
    textDecorationLine: 'underline',
  },
  confirmWrap: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  confirmIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(204, 255, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(204, 255, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500' as const,
    color: Colors.textPrimary,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
