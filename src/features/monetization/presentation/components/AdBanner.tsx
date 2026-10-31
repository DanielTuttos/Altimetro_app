import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useAppTheme } from '../../../../core/theme/use-app-theme';
import { getAdMobBannerUnitId } from '../../infrastructure/admob.config';

export const AdBanner: React.FC = () => {
  const { colors } = useAppTheme();
  const [adFailed, setAdFailed] = React.useState(false);
  const isMountedRef = React.useRef(false);

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const adUnitId = __DEV__ ? TestIds.BANNER : getAdMobBannerUnitId();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.surfaceBorder }]}>
      {adFailed ? (
        <View style={styles.placeholderContainer}>
          <Text style={[styles.adLabel, { color: colors.textSecondary }]}>PUBLICIDAD ADMOB (TEST MODE)</Text>
          <Text style={[styles.adContent, { color: colors.textPrimary }]}>
            Error al conectar con AdMob Test Server
          </Text>
        </View>
      ) : (
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
          onAdFailedToLoad={(error) => {
            console.warn('[AdMob Banner] Error al cargar anuncio:', error.message);
            if (isMountedRef.current) {
              setAdFailed(true);
            }
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 80,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    borderTopWidth: 1,
    paddingVertical: 12,
  },
  placeholderContainer: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
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

