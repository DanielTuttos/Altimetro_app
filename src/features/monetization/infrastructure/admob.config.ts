import { Platform } from 'react-native';

/**
 * Obtiene el ID del Banner de AdMob según la plataforma.
 * En desarrollo, si no existe variable de entorno, utiliza los IDs oficiales de prueba de Google.
 */
export const getAdMobBannerUnitId = (): string => {
  if (Platform.OS === 'ios') {
    return (
      process.env.EXPO_PUBLIC_ADMOB_BANNER_ID_IOS ||
      'ca-app-pub-3940256099942544/2934735716' // Test Banner ID iOS
    );
  }
  return (
    process.env.EXPO_PUBLIC_ADMOB_BANNER_ID_ANDROID ||
    'ca-app-pub-3940256099942544/6300978111' // Test Banner ID Android
  );
};

/**
 * Obtiene el ID del Interstitial de AdMob según la plataforma.
 * En desarrollo, si no existe variable de entorno, utiliza los IDs oficiales de prueba de Google.
 */
export const getAdMobInterstitialUnitId = (): string => {
  if (Platform.OS === 'ios') {
    return (
      process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID_IOS ||
      'ca-app-pub-3940256099942544/4411468910' // Test Interstitial ID iOS
    );
  }
  return (
    process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID_ANDROID ||
    'ca-app-pub-3940256099942544/1033173712' // Test Interstitial ID Android
  );
};
