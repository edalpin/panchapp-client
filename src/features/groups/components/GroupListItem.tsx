import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { colors } from '../../../theme/colors';
import type { Group, GroupStatus } from '../types/group';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function formatStatus(status: GroupStatus): string {
  return status === 'ACTIVE' ? 'Active' : 'Archived';
}

type GroupListItemProps = {
  group: Group;
  index: number;
};

export function GroupListItem({ group, index }: GroupListItemProps) {
  const isActive = group.status === 'ACTIVE';

  return (
    <AnimatedPressable
      entering={FadeInRight.delay(index * 100).duration(500)}
      style={({ pressed }: { pressed: boolean }) => [
        styles.groupCard,
        pressed && styles.groupCardPressed,
      ]}
    >
      <View style={styles.groupIconContainer}>
        <Ionicons
          color={group.isPersonal ? colors.accent : colors.darkText}
          name={group.isPersonal ? 'person' : 'people'}
          size={22}
        />
      </View>
      <View style={styles.groupInfo}>
        <View style={styles.groupHeaderRow}>
          <Text numberOfLines={1} style={styles.groupName}>
            {group.name}
          </Text>
          {group.isPersonal && (
            <View style={styles.personalBadge}>
              <Text style={styles.personalBadgeLabel}>Personal</Text>
            </View>
          )}
        </View>
        <View style={styles.groupFooterRow}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: isActive ? colors.success : colors.darkTextMuted },
            ]}
          />
          <Text style={styles.statusLabel}>{formatStatus(group.status)}</Text>
        </View>
      </View>
      <Ionicons color={colors.darkTextMuted} name="chevron-forward" size={20} />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  groupCard: {
    backgroundColor: colors.darkSurface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.darkBorder,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  groupCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  groupIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.darkSurfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  groupInfo: {
    flex: 1,
    gap: 4,
  },
  groupHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  groupName: {
    color: colors.darkText,
    fontSize: 17,
    fontWeight: '700',
    flexShrink: 1,
  },
  personalBadge: {
    backgroundColor: colors.accentMuted,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  personalBadgeLabel: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  groupFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusLabel: {
    color: colors.darkTextMuted,
    fontSize: 13,
    fontWeight: '500',
  },
});
