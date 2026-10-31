import React, { useEffect } from 'react';
import { ActivityIndicator, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useAppTheme } from '../core/theme/use-app-theme';
import { useAltitudeStore } from '../features/altitude/presentation/store/altitude.store';
import { AltitudeDisplay } from '../features/altitude/presentation/components/AltitudeDisplay';
import { AccuracyBadge } from '../features/altitude/presentation/components/AccuracyBadge';
import { AdBanner } from '../features/monetization/presentation/components/AdBanner';

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const { altitude, loading, permissionGranted, error, initialize, requestPermissions } = useAltitudeStore();

  useEffect(() => {
    initialize();
  }, []);

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Altímetro</Text>
        <TouchableOpacity
          onPress={() => router.push('/settings')}
          style={[styles.settingsButton, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}
        >
          <Text style={{ color: colors.textPrimary, fontSize: 16 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido Principal */}
      <View style={styles.content}>
        {!permissionGranted ? (
          <View style={[styles.permissionCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            <Text style={[styles.permissionTitle, { color: colors.textPrimary }]}>
              Permiso de Ubicación Requerido
            </Text>
            <Text style={[styles.permissionText, { color: colors.textSecondary }]}>
              La aplicación necesita acceso a la ubicación para calcular tu altitud exacta y margen de precisión.
            </Text>
            <TouchableOpacity
              onPress={requestPermissions}
              style={[styles.primaryButton, { backgroundColor: colors.accent }]}
            >
              <Text style={styles.primaryButtonText}>Conceder Permisos</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleOpenSettings} style={styles.secondaryButton}>
              <Text style={[styles.secondaryButtonText, { color: colors.accent }]}>
                Abrir Ajustes del Teléfono
              </Text>
            </TouchableOpacity>
          </View>
        ) : loading && !altitude ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Obteniendo lecturas de altitud...
            </Text>
          </View>
        ) : error && !altitude ? (
          <View style={[styles.permissionCard, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
            <Text style={[styles.permissionTitle, { color: colors.error }]}>
              Ubicación No Disponible
            </Text>
            <Text style={[styles.permissionText, { color: colors.textSecondary }]}>
              {error}
            </Text>
            <TouchableOpacity
              onPress={initialize}
              style={[styles.primaryButton, { backgroundColor: colors.accent }]}
            >
              <Text style={styles.primaryButtonText}>Reintentar Obtener Ubicación</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleOpenSettings} style={styles.secondaryButton}>
              <Text style={[styles.secondaryButtonText, { color: colors.accent }]}>
                Abrir Ajustes del Teléfono
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          altitude && (
            <>
              <AltitudeDisplay meters={altitude.meters} />
              <AccuracyBadge accuracyMeters={altitude.verticalAccuracyMeters} source={altitude.source} />

              {altitude.coordinates && (
                <View style={styles.coordsContainer}>
                  <Text style={[styles.coordsText, { color: colors.textSecondary }]}>
                    Lat: {altitude.coordinates.latitude.toFixed(4)}° | Lng: {altitude.coordinates.longitude.toFixed(4)}°
                  </Text>
                </View>
              )}
            </>
          )
        )}
      </View>

      {/* Ad Banner Inferior */}
      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  centerContainer: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
  },
  permissionCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    width: '100%',
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButton: {
    marginTop: 14,
  },
  secondaryButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  coordsContainer: {
    marginTop: 20,
  },
  coordsText: {
    fontSize: 13,
  },
});
