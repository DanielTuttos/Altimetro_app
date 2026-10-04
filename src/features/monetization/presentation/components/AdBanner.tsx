import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useMonetizationStore } from '../store/monetization.store';
import { useAppTheme } from '../../../../core/theme/use-app-theme';

export const AdBanner: React.FC = () => {
  const { colors } = useAppTheme();
  const isPro = useMonetizationStore((state) => state.isPro);

  if (isPro) {
    return null; // Desmontar si el usuario compro la suscripción Pro
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.surfaceBorder }]}>
      <Text style={[styles.adLabel, { color: colors.textSecondary }]}>ANUNCIO</Text>
      <Text style={[styles.adContent, { color: colors.textPrimary }]}>
        Publicidad Adaptativa Integrada (AdMob)
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 72,
    width: '100%',
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    paddingBottom: 8,
  },
  adLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },
  adContent: {
    fontSize: 13,
    fontWeight: '500',
  },
});
