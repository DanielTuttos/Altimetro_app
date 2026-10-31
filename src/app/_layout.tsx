import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import mobileAds from 'react-native-google-mobile-ads';
import { useAppTheme } from '../core/theme/use-app-theme';

export default function RootLayout() {
  const { isDark } = useAppTheme();

  useEffect(() => {
    mobileAds()
      .initialize()
      .then((adapterStatuses) => {
        console.log('[AdMob] SDK Inicializado correctamente:', adapterStatuses);
      })
      .catch((err) => {
        console.warn('[AdMob] Error al inicializar SDK:', err);
      });
  }, []);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} animated />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="settings" />
      </Stack>
    </>
  );
}


