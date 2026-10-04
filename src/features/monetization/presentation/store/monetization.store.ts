import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface MonetizationState {
  isPro: boolean;
  lastInterstitialAt: number | null;
  setIsPro: (isPro: boolean) => void;
  checkEntitlement: () => Promise<void>;
  shouldShowInterstitial: () => boolean;
  recordInterstitialShown: () => Promise<void>;
}

const LAST_INTERSTITIAL_KEY = '@altimeter_last_interstitial';

// Intervalo de 2 horas en milisegundos (120 min)
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

export const useMonetizationStore = create<MonetizationState>((set, get) => ({
  isPro: false,
  lastInterstitialAt: null,

  setIsPro: (isPro: boolean) => set({ isPro }),

  checkEntitlement: async () => {
    try {
      const storedTime = await AsyncStorage.getItem(LAST_INTERSTITIAL_KEY);
      set({
        lastInterstitialAt: storedTime ? parseInt(storedTime, 10) : null,
      });
      // RevenueCat check stub - sin login de usuario (anonimo)
    } catch {
      // Ignorar errores
    }
  },

  shouldShowInterstitial: () => {
    const { isPro, lastInterstitialAt } = get();
    if (isPro) return false;
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
