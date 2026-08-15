import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';

type ScreenContainerProps = {
  children: ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: ViewStyle;
  withGradient?: boolean;
};

export function ScreenContainer({
  children,
  scrollable = false,
  contentContainerStyle,
  withGradient = true,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  const safeAreaStyle = {
    flex: 1,
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
  };

  const Content = <View style={[styles.content, contentContainerStyle]}>{children}</View>;

  const inner = scrollable ? (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      style={styles.root}
    >
      {Content}
    </ScrollView>
  ) : (
    <View style={[styles.root, styles.content, contentContainerStyle]}>{children}</View>
  );

  if (withGradient) {
    return (
      <View style={styles.wrapper}>
        <LinearGradient colors={['#0A0A0A', '#000000']} style={StyleSheet.absoluteFill} />
        <View style={safeAreaStyle}>{inner}</View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={safeAreaStyle}>{inner}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.darkBg,
  },
  root: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 120, // Space for floating tab bar
  },
});
