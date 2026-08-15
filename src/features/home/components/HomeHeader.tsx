import { useQuery } from '@apollo/client/react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { UserAvatar } from '@/components/UserAvatar';
import { ME } from '@/features/auth/api/auth.query';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { HamburgerMenu } from '@/features/home/components/HamburgerMenu';
import { colors } from '@/theme/colors';

export function HomeHeader() {
  const { user } = useAuth();
  const { data, loading } = useQuery(ME);
  const displayUser = data?.me ?? user;
  const welcomeName = displayUser?.name ?? displayUser?.email?.split('@')[0];

  return (
    <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
      <View style={styles.headerTop}>
        <UserAvatar email={displayUser?.email} name={displayUser?.name} />
        <View style={styles.headerText}>
          <Text style={styles.greeting}>Hello, {welcomeName || 'there'}</Text>
          <Text style={styles.email}>
            {loading && !displayUser ? 'Syncing...' : displayUser?.email}
          </Text>
        </View>
        <HamburgerMenu />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 32,
    marginTop: 12,
    zIndex: 10,
    elevation: 10,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  email: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 2,
  },
});
