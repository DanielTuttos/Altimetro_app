import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: "Altímetro",
    slug: "altitude_app",
    version: "1.0.3",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "altitudeapp",
    userInterfaceStyle: "automatic",
    ios: {
      bundleIdentifier: "com.danielromeroag.altitudeapp",
      icon: "./assets/images/icon.png",
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          "Esta aplicación requiere acceso a tu ubicación para calcular la altitud exacta y elevación sobre el nivel del mar.",
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#0B0F19",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      predictiveBackGestureEnabled: false,
      package: "com.danielromeroag.altitudeapp",
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "com.google.android.gms.permission.AD_ID",
      ],
      blockedPermissions: ["android.permission.ACTIVITY_RECOGNITION"],
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#0B0F19",
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
        },
      ],
      [
        "react-native-google-mobile-ads",
        {
          androidAppId:
            process.env.EXPO_PUBLIC_ADMOB_APP_ID_ANDROID ||
            "ca-app-pub-3940256099942544~3347511713",
          iosAppId:
            process.env.EXPO_PUBLIC_ADMOB_APP_ID_IOS ||
            "ca-app-pub-3940256099942544~1458002511",
        },
      ],
      [
        "expo-build-properties",
        {
          ios: {
            enableSceneSupport: true,
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      ...config.extra,
      eas: {
        projectId: "90d27a46-dbe3-4395-8d67-5417d43a4409",
      },
    },
  };
};
