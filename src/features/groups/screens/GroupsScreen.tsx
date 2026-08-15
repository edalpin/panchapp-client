import { useQuery } from '@apollo/client/react';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ScreenContainer } from '@/components/ScreenContainer';
import { colors } from '@/theme/colors';
import { MY_GROUPS } from '@/features/groups/api/groups.query';
import type { MyGroupsQuery, MyGroupsQueryVariables } from '@/features/groups/types/groups.query';
import { GroupListItem } from '@/features/groups/components/GroupListItem';

export function GroupsScreen() {
  const { data, error, loading, refetch } = useQuery<MyGroupsQuery, MyGroupsQueryVariables>(
    MY_GROUPS,
    {
      variables: { first: 50 },
    },
  );

  const groups = data?.myGroups.nodes ?? [];

  if (loading && groups.length === 0) {
    return (
      <ScreenContainer contentContainerStyle={styles.centered}>
        <ActivityIndicator color={colors.accent} size="large" />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer contentContainerStyle={styles.centered}>
        <View style={styles.errorContainer}>
          <View style={styles.errorIconContainer}>
            <Ionicons color={colors.darkText} name="alert-circle" size={32} />
          </View>
          <Text style={styles.errorTitle}>Could not load groups</Text>
          <Text style={styles.errorMessage}>{error.message}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              void refetch();
            }}
            style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
          >
            <Text style={styles.retryLabel}>Try again</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer withGradient>
      <FlatList
        contentContainerStyle={[styles.listContent, groups.length === 0 && styles.emptyList]}
        data={groups}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Animated.View entering={FadeInDown.duration(600)} style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons color={colors.darkTextMuted} name="people-outline" size={48} />
            </View>
            <Text style={styles.emptyTitle}>No groups yet</Text>
            <Text style={styles.emptySubtitle}>Groups you join or create will appear here.</Text>
            <Pressable style={styles.createButton}>
              <Text style={styles.createButtonLabel}>Create first group</Text>
            </Pressable>
          </Animated.View>
        }
        ListHeaderComponent={
          <View style={styles.pageHeader}>
            <Text style={styles.title}>My Groups</Text>
          </View>
        }
        renderItem={({ item, index }) => <GroupListItem group={item} index={index} />}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 12,
  },
  title: {
    color: colors.darkText,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.darkSurfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.darkBorder,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.darkSurfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    color: colors.darkText,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    color: colors.darkTextMuted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: colors.darkText,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
  },
  createButtonLabel: {
    color: colors.darkBg,
    fontSize: 15,
    fontWeight: '700',
  },
  errorContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  errorTitle: {
    color: colors.darkText,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  errorMessage: {
    color: colors.darkTextMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.darkSurfaceElevated,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.darkBorder,
  },
  retryButtonPressed: {
    opacity: 0.8,
  },
  retryLabel: {
    color: colors.darkText,
    fontSize: 14,
    fontWeight: '600',
  },
});
