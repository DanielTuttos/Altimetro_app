import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsState {
  themeMode: ThemeMode;
  unit: 'meters' | 'feet';
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setUnit: (unit: 'meters' | 'feet') => Promise<void>;
  loadSettings: () => Promise<void>;
}

const THEME_STORAGE_KEY = '@altimeter_theme_mode';
const UNIT_STORAGE_KEY = '@altimeter_unit';

export const useSettingsStore = create<SettingsState>((set) => ({
  themeMode: 'system',
  unit: 'meters',

  loadSettings: async () => {
    try {
      const savedTheme = (await AsyncStorage.getItem(THEME_STORAGE_KEY)) as ThemeMode | null;
      const savedUnit = (await AsyncStorage.getItem(UNIT_STORAGE_KEY)) as 'meters' | 'feet' | null;

      set({
        themeMode: savedTheme || 'system',
        unit: savedUnit || 'meters',
      });
    } catch {
      // Usar valores por defecto en caso de error
    }
  },

  setThemeMode: async (mode: ThemeMode) => {
    set({ themeMode: mode });
    await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
  },

  setUnit: async (unit: 'meters' | 'feet') => {
    set({ unit });
    await AsyncStorage.setItem(UNIT_STORAGE_KEY, unit);
  },
}));
