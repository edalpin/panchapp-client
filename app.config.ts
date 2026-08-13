import type { ExpoConfig } from 'expo/config';

function reversedGoogleIosUrlScheme(iosClientId: string): string {
  const prefix = iosClientId.replace('.apps.googleusercontent.com', '');
  return `com.googleusercontent.apps.${prefix}`;
}

const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '';
const iosUrlSchemeEnv = process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME;

const plugins: ExpoConfig['plugins'] = ['expo-router', 'expo-secure-store', 'expo-web-browser'];

if (iosUrlSchemeEnv || iosClientId) {
  const iosUrlScheme = iosUrlSchemeEnv ?? reversedGoogleIosUrlScheme(iosClientId);

  plugins.push([
    '@react-native-google-signin/google-signin',
    {
      iosUrlScheme,
    },
  ]);
}

const config: ExpoConfig = {
  name: 'panchapp-client',
  slug: 'panchapp-client',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  scheme: 'panchapp',
  platforms: ['ios', 'web'],
  ios: {
    bundleIdentifier: 'com.panchapp.client',
    supportsTablet: true,
  },
  plugins,
};

export default config;
