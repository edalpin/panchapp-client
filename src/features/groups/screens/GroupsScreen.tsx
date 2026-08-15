import { useQuery } from '@apollo/client/react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenLoadingView } from '@/components/ScreenLoadingView';
import { MY_GROUPS } from '@/features/groups/api/groups.query';
import { GroupCard } from '@/features/groups/components/GroupCard';
import { GroupsEmptyState } from '@/features/groups/components/GroupsEmptyState';
import { GroupsErrorView } from '@/features/groups/components/GroupsErrorView';
import { GroupsPageHeader } from '@/features/groups/components/GroupsPageHeader';

export function GroupsScreen() {
  const { data, error, loading, refetch } = useQuery(MY_GROUPS, {
    variables: { first: 50 },
  });

  const groups = data?.myGroups.nodes ?? [];

  if (loading && groups.length === 0) {
    return <ScreenLoadingView />;
  }

  if (error) {
    return (
      <GroupsErrorView
        message={error.message}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <ScreenContainer withGradient>
      <FlatList
        contentContainerStyle={[styles.listContent, groups.length === 0 && styles.emptyList]}
        data={groups}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<GroupsEmptyState />}
        ListHeaderComponent={<GroupsPageHeader groupCount={groups.length} />}
        renderItem={({ item, index }) => <GroupCard group={item} index={index} />}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 24,
  },
  separator: {
    height: 12,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
