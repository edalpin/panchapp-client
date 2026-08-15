import { useQuery } from '@apollo/client/react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MY_GROUPS } from '@/features/groups/api/groups.query';
import { colors } from '@/theme/colors';

type GroupsSectionProps = {
  delay?: number;
};

export function GroupsSection({ delay = 0 }: GroupsSectionProps) {
  const router = useRouter();
  const { data } = useQuery(MY_GROUPS, {
    variables: { first: 5 },
  });
  const groups = data?.myGroups.nodes ?? [];

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(600)} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Groups</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              router.push('/groups');
            }}
          >
            <Text style={styles.showAll}>Show all</Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Pressable style={styles.groupItem}>
            <View style={styles.addButton}>
              <Ionicons color={colors.text} name="add" size={24} />
            </View>
            <Text style={styles.groupName}>Add New</Text>
          </Pressable>

          {groups.map((group) => (
            <Pressable key={group.id} style={styles.groupItem}>
              <View style={styles.avatarContainer}>
                <View
                  style={[
                    styles.avatarPlaceholder,
                    group.isPersonal && styles.personalAvatarPlaceholder,
                  ]}
                >
                  {group.isPersonal ? (
                    <Ionicons color={colors.accent} name="person" size={24} />
                  ) : (
                    <Text style={styles.avatarInitial}>{group.name[0]?.toUpperCase() ?? '?'}</Text>
                  )}
                </View>
                {group.isPersonal ? (
                  <View style={styles.personalBadge}>
                    <Ionicons color={colors.accent} name="star" size={8} />
                  </View>
                ) : null}
              </View>
              <Text numberOfLines={1} style={styles.groupName}>
                {group.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  showAll: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContent: {
    gap: 20,
    paddingRight: 20,
  },
  groupItem: {
    alignItems: 'center',
    gap: 8,
    width: 64,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.glass,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  personalAvatarPlaceholder: {
    backgroundColor: colors.accentMuted,
    borderColor: colors.accentBorder,
  },
  avatarInitial: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  personalBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  groupName: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});
