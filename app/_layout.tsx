import 'react-native-reanimated';

import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider } from '../src/auth/AuthProvider';
import { configureGoogleSignIn } from '../src/auth/googleSignIn';

export default function RootLayout() {
  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </AuthProvider>
  );
}
