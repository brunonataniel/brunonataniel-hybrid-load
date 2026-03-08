import React, { useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Animated, Image, Dimensions } from 'react-native';
import { Colors } from '@/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AnimatedSplashProps {
  onFinish: () => void;
  logoUrl: string;
}

export default function AnimatedSplash({ onFinish, logoUrl }: AnimatedSplashProps) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  const runAnimation = useCallback(() => {
    console.log('[AnimatedSplash] Starting splash animation');

    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(glowOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(1200),
      Animated.parallel([
        Animated.timing(containerOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      console.log('[AnimatedSplash] Animation complete');
      onFinish();
    });
  }, [logoOpacity, logoScale, glowOpacity, containerOpacity, onFinish]);

  useEffect(() => {
    runAnimation();
  }, [runAnimation]);

  const logoSize = SCREEN_WIDTH * 0.38;

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      <Animated.View
        style={[
          styles.glowOuter,
          {
            opacity: glowOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.3],
            }),
          },
        ]}
      />
      <Animated.View
        style={[
          styles.glowInner,
          {
            opacity: glowOpacity.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.15],
            }),
          },
        ]}
      />
      <Animated.View
        style={{
          opacity: logoOpacity,
          transform: [{ scale: logoScale }],
        }}
      >
        <Image
          source={{ uri: logoUrl }}
          style={{ width: logoSize, height: logoSize, borderRadius: 20 }}
          resizeMode="contain"
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  glowOuter: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.accent,
  },
  glowInner: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.accent,
  },
});
