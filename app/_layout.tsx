import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { AppProvider } from "@/providers/AppProvider";

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

export default function RootLayout() {
  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <GestureHandlerRootView style={styles.root}>
          <View style={styles.outerBg}>
            <View style={styles.innerContainer}>
              <StatusBar style="light" />
              <RootLayoutNav />
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
    maxWidth: 768,
  },
});
