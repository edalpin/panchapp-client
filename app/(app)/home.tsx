import { useQuery } from '@apollo/client/react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../../src/auth/AuthProvider';
import { ScreenContainer } from '../../src/components/ScreenContainer';
import { ME, type MeQuery } from '../../src/graphql/operations/auth';
import { colors } from '../../src/theme/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function InteractiveCard({
  children,
  style,
  delay = 0,
}: {
  children: React.ReactNode;
  style?: any;
  delay?: number;
}) {
  return (
    <AnimatedPressable
      entering={FadeInDown.delay(delay).duration(600)}
      style={({ pressed }: { pressed: boolean }) => [
        styles.card,
        pressed && styles.cardPressed,
        style,
      ]}
    >
      {children}
    </AnimatedPressable>
  );
}

export default function HomeScreen() {
  const { signOut, user } = useAuth();
  const { data, loading } = useQuery<MeQuery>(ME);
  const displayUser = data?.me ?? user;
  const welcomeName = displayUser?.name ?? displayUser?.email?.split('@')[0];

  return (
    <ScreenContainer scrollable>
      <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{welcomeName?.[0]?.toUpperCase() ?? 'U'}</Text>
          </View>
          <View>
            <Text style={styles.greeting}>Hello, {welcomeName || 'there'}</Text>
            <Text style={styles.email}>
              {loading && !displayUser ? 'Syncing...' : displayUser?.email}
            </Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.grid}>
        <InteractiveCard delay={100} style={styles.largeCard}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: colors.accentMuted }]}>
              <Ionicons color={colors.accent} name="calendar" size={20} />
            </View>
            <Text style={styles.sectionTitle}>Upcoming events</Text>
          </View>
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No plans yet</Text>
            <Text style={styles.emptySubtitle}>Your upcoming sessions will appear here.</Text>
          </View>
        </InteractiveCard>

        <View style={styles.row}>
          <InteractiveCard delay={200} style={styles.halfCard}>
            <View style={styles.iconContainer}>
              <Ionicons color={colors.darkText} name="people" size={20} />
            </View>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Groups</Text>
          </InteractiveCard>

          <InteractiveCard delay={300} style={styles.halfCard}>
            <View style={styles.iconContainer}>
              <Ionicons color={colors.darkText} name="flash" size={20} />
            </View>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Activity</Text>
          </InteractiveCard>
        </View>
      </View>

      <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.footer}>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            void signOut();
          }}
          style={({ pressed }) => [styles.signOutButton, pressed && styles.signOutButtonPressed]}
        >
          <Ionicons color={colors.darkTextMuted} name="log-out-outline" size={18} />
          <Text style={styles.signOutLabel}>Sign out</Text>
        </Pressable>
      </Animated.View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 32,
    marginTop: 12,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.darkSurfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.darkBorder,
  },
  avatarText: {
    color: colors.darkText,
    fontSize: 20,
    fontWeight: '700',
  },
  greeting: {
    color: colors.darkText,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  email: {
    color: colors.darkTextMuted,
    fontSize: 14,
    marginTop: 2,
  },
  grid: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  card: {
    backgroundColor: colors.darkSurface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.darkBorder,
    padding: 20,
  },
  cardPressed: {
    transform: [{ scale: 0.97 }],
  },
  largeCard: {
    minHeight: 180,
  },
  halfCard: {
    flex: 1,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.darkSurfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  sectionTitle: {
    color: colors.darkText,
    fontSize: 18,
    fontWeight: '700',
  },
  statNumber: {
    color: colors.darkText,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 8,
  },
  statLabel: {
    color: colors.darkTextMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyTitle: {
    color: colors.darkText,
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtitle: {
    color: colors.darkTextMuted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
    paddingBottom: 20,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 100,
    backgroundColor: colors.darkSurfaceElevated,
    borderWidth: 1,
    borderColor: colors.darkBorder,
  },
  signOutButtonPressed: {
    backgroundColor: colors.darkBorder,
    transform: [{ scale: 0.98 }],
  },
  signOutLabel: {
    color: colors.darkTextMuted,
    fontSize: 15,
    fontWeight: '600',
  },
});
