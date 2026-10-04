import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../../../../core/theme/use-app-theme';
import { useSettingsStore } from '../../../settings/presentation/store/settings.store';

interface AltitudeDisplayProps {
  meters: number;
}

export const AltitudeDisplay: React.FC<AltitudeDisplayProps> = ({ meters }) => {
  const { colors } = useAppTheme();
  const unit = useSettingsStore((state) => state.unit);

  const displayValue = unit === 'feet' ? Math.round(meters * 3.28084) : Math.round(meters);
  const unitLabel = unit === 'feet' ? 'PIES' : 'METROS';
  const unitSymbol = unit === 'feet' ? 'ft' : 'm';

  return (
    <View style={styles.container}>
      {/* Esfera Instrumental Principal */}
      <View
        style={[
          styles.dialCircle,
          {
            backgroundColor: colors.surface,
            borderColor: colors.surfaceBorder,
          },
        ]}
      >
        {/* Anillo de resplandor interior */}
        <View style={[styles.glowRing, { backgroundColor: colors.accentGlow }]} />

        {/* Título de la métrica */}
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          ALTITUD SOBRE NIVEL DEL MAR
        </Text>

        {/* Valor numérico principal */}
        <Text style={[styles.valueText, { color: colors.textPrimary }]} numberOfLines={1} adjustsFontSizeToFit>
          {displayValue.toLocaleString()}
        </Text>

        {/* Etiqueta de unidad de medida */}
        <View style={[styles.unitBadge, { backgroundColor: colors.accentGlow, borderColor: colors.accent }]}>
          <Text style={[styles.unitText, { color: colors.accent }]}>
            {unitSymbol} • {unitLabel}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  dialCircle: {
    width: 290,
    height: 290,
    borderRadius: 145,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  glowRing: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    opacity: 0.4,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginBottom: 6,
    maxWidth: 210,
  },
  valueText: {
    fontSize: 54,
    fontWeight: '800',
    letterSpacing: -1.5,
    textAlign: 'center',
    marginVertical: 2,
  },
  unitBadge: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  unitText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
});

