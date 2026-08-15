import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '@/theme/colors';

export function GroupsEmptyState() {
  return (
    <Animated.View entering={FadeInDown.duration(600)} style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons color={colors.textMuted} name="people-outline" size={48} />
      </View>
      <Text style={styles.title}>No groups yet</Text>
      <Text style={styles.subtitle}>Groups you join or create will appear here.</Text>
      <Pressable style={styles.createButton}>
        <Text style={styles.createButtonLabel}>Create first group</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.glassBorder,
    borderRadius: 40,
    borderWidth: 1,
    height: 80,
    justifyContent: 'center',
    marginBottom: 20,
    width: 80,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: colors.text,
    borderRadius: 100,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  createButtonLabel: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '700',
  },
});
