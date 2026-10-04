import React from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors, ThemeColors } from '../theme/colors';
import { useSettingsStore } from '../../features/settings/presentation/store/settings.store';

export function useAppTheme(): { colors: ThemeColors; isDark: boolean } {
  const systemColorScheme = useColorScheme();
  const themeMode = useSettingsStore((state) => state.themeMode);

  const isDark =
    themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');

  const colors = isDark ? darkColors : lightColors;

  return { colors, isDark };
}
