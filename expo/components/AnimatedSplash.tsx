import React, { useEffect, useRef, useCallback } from 'react';
import { StyleSheet, Animated, Image, Dimensions, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AnimatedSplashProps {
  onFinish: () => void;
  logoUrl: string;
}

export default function AnimatedSplash({ onFinish, logoUrl }: AnimatedSplashProps) {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.85)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  const runAnimation = useCallback(() => {
    console.log('[AnimatedSplash] Starting splash animation');

    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 10,
          tension: 50,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(1000),
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      console.log('[AnimatedSplash] Animation complete');
      onFinish();
    });
  }, [logoOpacity, logoScale, containerOpacity, onFinish]);

  useEffect(() => {
    runAnimation();
  }, [runAnimation]);

  const logoSize = SCREEN_WIDTH * 0.38;

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      <View style={styles.logoWrapper}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <Image
            source={{ uri: logoUrl }}
            style={{ width: logoSize, height: logoSize, borderRadius: 20 }}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
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
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    zIndex: 1,
  },
});
