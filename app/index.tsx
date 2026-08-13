import { Redirect } from 'expo-router';
import { useAuth } from '../src/auth/AuthProvider';
import { AuthLoadingView } from '../src/components/AuthLoadingView';

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
