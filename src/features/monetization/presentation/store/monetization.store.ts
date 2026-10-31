import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface MonetizationState {
  lastInterstitialAt: number | null;
  shouldShowInterstitial: () => boolean;
  recordInterstitialShown: () => Promise<void>;
}

const LAST_INTERSTITIAL_KEY = '@altimeter_last_interstitial';

// Intervalo de 2 horas en milisegundos (120 min)
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

export const useMonetizationStore = create<MonetizationState>((set, get) => ({
  lastInterstitialAt: null,

  shouldShowInterstitial: () => {
    const { lastInterstitialAt } = get();
    if (!lastInterstitialAt) return true;

    const now = Date.now();
    return now - lastInterstitialAt >= TWO_HOURS_MS;
  },

  recordInterstitialShown: async () => {
    const now = Date.now();
    set({ lastInterstitialAt: now });
    await AsyncStorage.setItem(LAST_INTERSTITIAL_KEY, now.toString());
  },
}));
