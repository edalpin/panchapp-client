import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';

type GroupsPageHeaderProps = {
  groupCount: number;
};

export function GroupsPageHeader({ groupCount }: GroupsPageHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Groups</Text>
      {groupCount > 0 ? (
        <Text style={styles.subtitle}>
          {groupCount} {groupCount === 1 ? 'group' : 'groups'}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginTop: 12,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
});
