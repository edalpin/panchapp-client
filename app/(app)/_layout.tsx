import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { colors } from '@/theme/colors';

export default function AppLayout() {
  const { status } = useAuth();
  const insets = useSafeAreaInsets();

  if (status === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (status === 'unauthenticated') {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.darkText,
        tabBarInactiveTintColor: colors.darkTextMuted,
        tabBarStyle: {
          position: 'absolute',
          bottom: insets.bottom + 24,
          left: 24,
          right: 24,
          height: 64,
          backgroundColor: 'rgba(20, 20, 20, 0.85)',
          borderRadius: 32,
          borderTopWidth: 1,
          borderWidth: 1,
          borderColor: colors.glassBorder,
          paddingTop: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginBottom: 10,
        },
        tabBarItemStyle: {
          height: 64,
          paddingVertical: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons color={color} name={focused ? 'home' : 'home-outline'} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons color={color} name={focused ? 'people' : 'people-outline'} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.darkBg,
  },
});
