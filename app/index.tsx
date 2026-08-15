import { Redirect } from 'expo-router';
import { AuthLoadingView } from '../src/features/auth/components/AuthLoadingView';
import { useAuth } from '../src/features/auth/context/AuthProvider';

export default function Index() {
  const { status } = useAuth();

  if (status === 'loading') {
    return <AuthLoadingView />;
  }

  if (status === 'authenticated') {
    return <Redirect href="/(app)/home" />;
  }

  return <Redirect href="/(auth)/login" />;
}
