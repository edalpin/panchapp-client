import { ActivityIndicator, StyleSheet } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { colors } from '@/theme/colors';

export function ScreenLoadingView() {
  return (
    <ScreenContainer contentContainerStyle={styles.centered}>
      <ActivityIndicator color={colors.accent} size="large" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
