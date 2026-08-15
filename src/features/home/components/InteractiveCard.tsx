import type { ReactNode } from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '@/theme/colors';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type InteractiveCardProps = {
  children: ReactNode;
  style?: ViewStyle;
  delay?: number;
};

export function InteractiveCard({ children, style, delay = 0 }: InteractiveCardProps) {
  return (
    <AnimatedPressable
      entering={FadeInDown.delay(delay).duration(600)}
      style={({ pressed }: { pressed: boolean }) => [
        styles.card,
        pressed && styles.cardPressed,
        style,
      ]}
    >
      {children}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.darkSurface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.darkBorder,
    padding: 20,
  },
  cardPressed: {
    transform: [{ scale: 0.97 }],
  },
});
