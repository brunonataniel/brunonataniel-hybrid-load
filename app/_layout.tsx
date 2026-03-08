import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { AppProvider } from "@/providers/AppProvider";
import AnimatedSplash from "@/components/AnimatedSplash";

void SplashScreen.preventAutoHideAsync().catch(() => {});
console.log('[RootLayout] Initializing app v2');

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="privacy" options={{ presentation: 'modal' }} />
      <Stack.Screen name="terms" options={{ presentation: 'modal' }} />
      <Stack.Screen name="impressum" options={{ presentation: 'modal' }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

const LOGO_URL = 'https://r2-pub.rork.com/generated-images/ad7cd1ad-6a31-4577-b3a6-dd32ceddc30d.png';
const FAVICON_URL = 'https://r2-pub.rork.com/generated-images/0b4f1e20-5658-49a3-ad27-903c0dc8bf34.png';

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState<boolean>(true);

  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    try {
      const existingIcons = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]');
      existingIcons.forEach((el) => el.parentNode?.removeChild(el));

      const sizes = [
        { rel: 'icon', type: 'image/png', size: '32x32' },
        { rel: 'icon', type: 'image/png', size: '16x16' },
        { rel: 'apple-touch-icon', type: 'image/png', size: '180x180' },
        { rel: 'shortcut icon', type: 'image/png', size: undefined },
      ];

      sizes.forEach(({ rel, type, size }) => {
        const link = document.createElement('link');
        link.rel = rel;
        link.type = type;
        link.href = `${FAVICON_URL}?v=2`;
        if (size) link.setAttribute('sizes', size);
        document.head.appendChild(link);
      });

      console.log('[RootLayout] Favicon updated to Hyper-H');
    } catch (e) {
      console.log('[RootLayout] Favicon update skipped:', e);
    }
  }, []);

  const handleSplashFinish = useCallback(() => {
    console.log('[RootLayout] Splash animation finished');
    setShowSplash(false);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <GestureHandlerRootView style={styles.root}>
          <View style={styles.outerBg}>
            <View style={styles.innerContainer}>
              <StatusBar style="light" />
              <RootLayoutNav />
              {showSplash && (
                <AnimatedSplash onFinish={handleSplashFinish} logoUrl={LOGO_URL} />
              )}
            </View>
          </View>
        </GestureHandlerRootView>
      </AppProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  outerBg: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
  },
});
