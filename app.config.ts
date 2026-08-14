import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'panchapp-client',
  slug: 'panchapp-client',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  scheme: 'panchapp',
  platforms: ['web'],
  plugins: ['expo-router', 'expo-web-browser'],
};

export default config;
