import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '@/theme/colors';

type GoogleSignInButtonProps = {
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

export function GoogleSignInButton({
  onPress,
  loading = false,
  disabled = false,
}: GoogleSignInButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isDisabled && styles.buttonDisabled,
        pressed && !isDisabled && styles.buttonPressed,
        pressed && !isDisabled && styles.buttonScale,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <Text style={styles.label}>Continue with Google</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonPressed: {
    backgroundColor: '#f8fafc',
  },
  buttonScale: {
    transform: [{ scale: 0.97 }],
  },
  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
