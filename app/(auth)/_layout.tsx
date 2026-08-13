import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../src/auth/AuthProvider';
import { AuthLoadingView } from '../../src/components/AuthLoadingView';

export default function AuthLayout() {
  const { status } = useAuth();

  if (status === 'loading') {
    return <AuthLoadingView />;
  }

  if (status === 'authenticated') {
    return <Redirect href="/(app)/home" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="login" />
    </Stack>
  );
}
