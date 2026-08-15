import { Redirect, Tabs } from 'expo-router';
import { FloatingTabBar } from '@/components/FloatingTabBar';
import { ScreenLoadingView } from '@/components/ScreenLoadingView';
import { useAuth } from '@/features/auth/context/AuthProvider';

export default function AppLayout() {
  const { status } = useAuth();

  if (status === 'loading') {
    return <ScreenLoadingView />;
  }

  if (status === 'unauthenticated') {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <FloatingTabBar {...props} />}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="groups" options={{ title: 'Groups' }} />
    </Tabs>
  );
}
