import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, gradients } from '@/theme/colors';

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
        styles.container,
        isDisabled && styles.buttonDisabled,
        pressed && !isDisabled && styles.buttonScale,
      ]}
    >
      <LinearGradient
        colors={[...gradients.primaryButton]}
        end={{ x: 1, y: 0 }}
        start={{ x: 0, y: 0 }}
        style={styles.gradient}
      >
        {loading ? (
          <ActivityIndicator color={colors.onPrimary} />
        ) : (
          <View style={styles.content}>
            <View style={styles.leftIcon}>
              <Ionicons color={colors.onPrimary} name="logo-google" size={20} />
            </View>
            <Text style={styles.label}>Login</Text>
            <Ionicons
              color={colors.textSubtle}
              name="sparkles-sharp"
              size={16}
              style={styles.rightIcon}
            />
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 64,
    paddingHorizontal: 24,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  leftIcon: {
    marginRight: 10,
  },
  rightIcon: {
    marginLeft: 6,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonScale: {
    transform: [{ scale: 0.98 }],
  },
  label: {
    color: colors.onPrimary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
