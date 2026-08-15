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
    themeColor: '#1e293b',
    backgroundColor: '#1e293b',
    orientation: 'portrait',
    barStyle: 'black-translucent',
    name: 'Panchapp',
    shortName: 'Panchapp',
    favicon: './assets/logo.png',
  },
  plugins: ['expo-router', 'expo-web-browser'],
};

export default config;
