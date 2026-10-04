import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../../../../core/theme/use-app-theme';

interface AccuracyBadgeProps {
  accuracyMeters: number | null;
  source: string;
}

export const AccuracyBadge: React.FC<AccuracyBadgeProps> = ({ accuracyMeters, source }) => {
  const { colors } = useAppTheme();

  const getStatusColor = () => {
    if (accuracyMeters === null) return colors.warning;
    if (accuracyMeters <= 10) return colors.success;
    if (accuracyMeters <= 25) return colors.accent;
    return colors.warning;
  };

  const statusColor = getStatusColor();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
      <View style={[styles.dot, { backgroundColor: statusColor }]} />
      <Text style={[styles.text, { color: colors.textSecondary }]}>
        Fuente: <Text style={{ color: colors.textPrimary, fontWeight: '600' }}>{source}</Text>
        {accuracyMeters !== null ? ` (±${Math.round(accuracyMeters)}m)` : ''}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  text: {
    fontSize: 13,
  },
});
