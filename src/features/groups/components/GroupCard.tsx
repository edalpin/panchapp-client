import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import type { Group, GroupStatus } from '@/features/groups/types/group';

const AnimatedView = Animated.createAnimatedComponent(View);

function formatStatus(status: GroupStatus): string {
  return status === 'ACTIVE' ? 'Active' : 'Archived';
}

type GroupCardProps = {
  group: Group;
  index: number;
};

export function GroupCard({ group, index }: GroupCardProps) {
  const isActive = group.status === 'ACTIVE';

  return (
    <AnimatedView entering={FadeInDown.delay(index * 80).duration(500)}>
      <Pressable>
        {({ pressed }: { pressed: boolean }) => (
          <View style={[styles.card, pressed && styles.cardPressed]}>
            <View style={[styles.iconContainer, group.isPersonal && styles.personalIconContainer]}>
              {group.isPersonal ? (
                <Ionicons color={colors.accent} name="person" size={28} />
              ) : (
                <Text style={styles.iconInitial}>{group.name[0]?.toUpperCase() ?? '?'}</Text>
              )}
            </View>

            <View style={styles.content}>
              <View style={styles.headerRow}>
                <Text numberOfLines={1} style={styles.name}>
                  {group.name}
                </Text>
                {group.isPersonal ? (
                  <View style={styles.personalBadge}>
                    <Ionicons color={colors.accent} name="star" size={10} />
                    <Text style={styles.personalBadgeLabel}>Personal</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.footerRow}>
                <View
                  style={[
                    styles.statusIndicator,
                    { backgroundColor: isActive ? colors.success : colors.textMuted },
                  ]}
                />
                <Text style={styles.statusLabel}>{formatStatus(group.status)}</Text>
              </View>
            </View>

            <View style={styles.chevronContainer}>
              <Ionicons color={colors.textMuted} name="chevron-forward" size={20} />
            </View>
          </View>
        )}
      </Pressable>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.glassBorder,
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 16,
    padding: 20,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.glassBorder,
    borderRadius: 18,
    borderWidth: 1,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  personalIconContainer: {
    backgroundColor: colors.accentMuted,
    borderColor: colors.accentBorder,
  },
  iconInitial: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  name: {
    color: colors.text,
    flexShrink: 1,
    fontSize: 18,
    fontWeight: '700',
  },
  personalBadge: {
    alignItems: 'center',
    backgroundColor: colors.accentMuted,
    borderColor: colors.accentBorder,
    borderRadius: 100,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  personalBadgeLabel: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  statusIndicator: {
    borderRadius: 3,
    height: 6,
    width: 6,
  },
  statusLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  chevronContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
  },
});
