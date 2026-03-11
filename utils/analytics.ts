import { Platform } from 'react-native';

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number> }) => void;
  }
}

let lastCalculationKey = '';

function getPlausible(): ((event: string, options?: { props?: Record<string, string | number> }) => void) | null {
  if (Platform.OS !== 'web') return null;
  if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
    return window.plausible;
  }
  return null;
}

function track(event: string, props?: Record<string, string | number>) {
  const plausible = getPlausible();
  if (!plausible) {
    console.log('[Analytics] (no-op, not web or plausible not loaded)', event, props);
    return;
  }
  console.log('[Analytics]', event, props);
  if (props) {
    plausible(event, { props });
  } else {
    plausible(event);
  }
}

export function injectPlausibleScript() {
  if (Platform.OS !== 'web') return;
  if (typeof document === 'undefined') return;

  const existing = document.querySelector('script[src*="plausible.io"]');
  if (existing) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://plausible.io/js/pa-Z4we91_lk4HasYNOFMFPj.js';
  document.head.appendChild(script);

  const inline = document.createElement('script');
  inline.textContent = 'window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()';
  document.head.appendChild(inline);

  console.log('[Analytics] Plausible script injected');
}

export function trackClickedOpenCalculator() {
  track('Clicked Open Calculator');
}

export function trackClickedSubscribe() {
  track('Clicked Subscribe');
}

export function trackEmailSubmittedLanding() {
  track('Email Submitted Landing');
}

export function trackExerciseSelected(exercise: string) {
  track('Exercise Selected', { exercise: exercise.toLowerCase() });
}

export function trackFatigueTagSelected(tag: string, totalTags: number) {
  track('Fatigue Tag Selected', { tag: tag.toLowerCase(), total_tags: totalTags });
}

export function trackIntensityChanged(tag: string, intensity: string) {
  track('Intensity Changed', { tag: tag.toLowerCase(), intensity: intensity.toLowerCase() });
}

export function trackCalculationCompleted(exercise: string, totalTags: number, penaltyPercent: number) {
  const key = `${exercise}-${totalTags}-${penaltyPercent}`;
  if (key === lastCalculationKey) return;
  lastCalculationKey = key;
  track('Calculation Completed', {
    exercise: exercise.toLowerCase(),
    total_tags: totalTags,
    penalty_percent: -Math.abs(penaltyPercent),
  });
}

export function resetCalculationKey() {
  lastCalculationKey = '';
}

export function trackUnitToggled(unit: string) {
  track('Unit Toggled', { unit: unit.toLowerCase() });
}

export function trackNotifyMeTapped(source: 'plate_visualizer' | 'history_tab') {
  track('Notify Me Tapped', { source });
}

export function trackEmailSubmittedPro(source: 'plate_visualizer' | 'history_tab') {
  track('Email Submitted Pro', { source });
}
