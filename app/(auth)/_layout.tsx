import { Redirect, Stack } from 'expo-router';
import { AuthLoadingView } from '../../src/features/auth/components/AuthLoadingView';
import { useAuth } from '../../src/features/auth/context/AuthProvider';

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
