import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { colors } from '@/theme/colors';

type GroupsErrorViewProps = {
  message: string;
  onRetry: () => void;
};

export function GroupsErrorView({ message, onRetry }: GroupsErrorViewProps) {
  return (
    <ScreenContainer contentContainerStyle={styles.centered}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons color={colors.text} name="alert-circle" size={32} />
        </View>
        <Text style={styles.title}>Could not load groups</Text>
        <Text style={styles.message}>{message}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
        >
          <Text style={styles.retryLabel}>Try again</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors.errorSurface,
    borderRadius: 32,
    height: 64,
    justifyContent: 'center',
    marginBottom: 16,
    width: 64,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  retryButtonPressed: {
    opacity: 0.8,
  },
  retryLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
