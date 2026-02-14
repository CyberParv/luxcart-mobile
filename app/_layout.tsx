import '../global.css';

import { Stack } from 'expo-router';
import * as Linking from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ErrorBoundary from '@/components/ErrorBoundary';
import { AuthProvider } from '@/providers/AuthProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { ToastProvider } from '@/providers/ToastProvider';

SplashScreen.preventAutoHideAsync().catch(() => {
  // no-op: can throw if called twice
});

function RootContainer({ children }: { children: React.ReactNode }) {
  if (Platform.OS === 'web') {
    return <View style={{ flex: 1 }}>{children}</View>;
  }
  return <GestureHandlerRootView style={{ flex: 1 }}>{children}</GestureHandlerRootView>;
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  const onReady = useCallback(async () => {
    // In a real app you might load fonts, hydrate caches, etc.
    // AuthProvider handles its own bootstrap; we just ensure at least one tick.
    await new Promise((r) => setTimeout(r, 0));
    setIsReady(true);
  }, []);

  useEffect(() => {
    onReady();
  }, [onReady]);

  useEffect(() => {
    if (!isReady) return;
    SplashScreen.hideAsync().catch(() => {
      // no-op
    });
  }, [isReady]);

  const deepLinkHandler = useMemo(() => {
    return (event: { url: string }) => {
      // Expo Router handles linking; this is for app-level side effects if needed.
      // Keep minimal and safe.
      const url = event?.url;
      if (!url) return;
      // Example: could log analytics here.
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    const sub = Linking.addEventListener('url', deepLinkHandler);
    return () => {
      sub.remove();
    };
  }, [deepLinkHandler]);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <RootContainer>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    animation: Platform.OS === 'web' ? 'none' : 'default'
                  }}
                />
              </RootContainer>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
