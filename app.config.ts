import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'panchapp-client',
  slug: 'panchapp-client',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/logo.png',
  userInterfaceStyle: 'light',
  scheme: 'panchapp',
  platforms: ['web'],
  web: {
    output: 'single',
    display: 'standalone',
    themeColor: '#000000',
    backgroundColor: '#000000',
    orientation: 'portrait',
    barStyle: 'black-translucent',
    name: 'Panchapp',
    shortName: 'Panchapp',
    favicon: './assets/logo.png',
  },
  plugins: ['expo-router', 'expo-web-browser'],
};

export default config;
