import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { useAppTheme } from '../../../../core/theme/use-app-theme';
import { getAdMobBannerUnitId } from '../../infrastructure/admob.config';

export const AdBanner: React.FC = () => {
  const { colors } = useAppTheme();
  const [adLoaded, setAdLoaded] = React.useState(false);
  const [retryKey, setRetryKey] = React.useState(0);
  const isMountedRef = React.useRef(false);
  const retryTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
    };
  }, []);

  const adUnitId = __DEV__ ? TestIds.BANNER : getAdMobBannerUnitId();

  return (
    <View
      pointerEvents={adLoaded ? 'auto' : 'none'}
      style={[
        styles.container,
        adLoaded
          ? {
              backgroundColor: colors.surface,
              borderColor: colors.surfaceBorder,
              borderTopWidth: 1,
              paddingVertical: 12,
              minHeight: 74,
              opacity: 1,
            }
          : styles.hiddenContainer,
      ]}
    >
      <BannerAd
        key={retryKey}
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          if (isMountedRef.current) {
            setAdLoaded(true);
          }
        }}
        onAdFailedToLoad={(error) => {
          if (__DEV__) {
            console.warn('[AdMob Banner] No disponible:', error.message);
          }
          if (isMountedRef.current) {
            setAdLoaded(false);
            if (retryTimerRef.current) {
              clearTimeout(retryTimerRef.current);
            }
            retryTimerRef.current = setTimeout(() => {
              if (isMountedRef.current) {
                setRetryKey((prev) => prev + 1);
              }
            }, 60000);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
  },
  hiddenContainer: {
    opacity: 0,
    height: 0,
    overflow: 'hidden',
  },
});

