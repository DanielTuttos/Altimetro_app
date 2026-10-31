import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useAppTheme } from '../core/theme/use-app-theme';
import { ThemeMode, useSettingsStore } from '../features/settings/presentation/store/settings.store';

export default function SettingsScreen() {
  const { colors } = useAppTheme();
  const { themeMode, unit, setThemeMode, setUnit } = useSettingsStore();

  const handleOpenAppSettings = () => {
    Linking.openSettings();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.accent }]}>← Volver</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Ajustes</Text>
      </View>

      {/* Sección 1: Tema */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>TEMA VISUAL</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
          {(['system', 'light', 'dark'] as ThemeMode[]).map((mode) => (
            <TouchableOpacity
              key={mode}
              onPress={() => setThemeMode(mode)}
              style={[
                styles.optionRow,
                themeMode === mode && { backgroundColor: colors.accentGlow },
              ]}
            >
              <Text style={[styles.optionText, { color: colors.textPrimary }]}>
                {mode === 'system' ? '🔮 Sistema' : mode === 'light' ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
              </Text>
              {themeMode === mode && <Text style={{ color: colors.accent, fontWeight: '700' }}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sección 2: Unidades */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>UNIDAD DE MEDIDA</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
          <TouchableOpacity
            onPress={() => setUnit('meters')}
            style={[styles.optionRow, unit === 'meters' && { backgroundColor: colors.accentGlow }]}
          >
            <Text style={[styles.optionText, { color: colors.textPrimary }]}>Metros (m)</Text>
            {unit === 'meters' && <Text style={{ color: colors.accent, fontWeight: '700' }}>✓</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setUnit('feet')}
            style={[styles.optionRow, unit === 'feet' && { backgroundColor: colors.accentGlow }]}
          >
            <Text style={[styles.optionText, { color: colors.textPrimary }]}>Pies (ft)</Text>
            {unit === 'feet' && <Text style={{ color: colors.accent, fontWeight: '700' }}>✓</Text>}
          </TouchableOpacity>
        </View>
      </View>

      {/* Sección 3: Permisos del Sistema */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>PERMISOS DEL DISPOSITIVO</Text>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
          <TouchableOpacity onPress={handleOpenAppSettings} style={styles.optionRow}>
            <View>
              <Text style={[styles.optionText, { color: colors.textPrimary }]}>Configuración del Teléfono</Text>
              <Text style={[styles.subText, { color: colors.textSecondary }]}>
                Gestionar permisos de GPS y sensores
              </Text>
            </View>
            <Text style={{ color: colors.textSecondary }}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    marginBottom: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
  },
  subText: {
    fontSize: 12,
    marginTop: 2,
  },
  actionButton: {
    margin: 12,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
});
