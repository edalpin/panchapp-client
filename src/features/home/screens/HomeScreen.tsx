import { StyleSheet, View } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { GroupsSection } from '@/features/home/components/GroupsSection';
import { HomeHeader } from '@/features/home/components/HomeHeader';
import { UpcomingCard } from '@/features/home/components/UpcomingCard';

export function HomeScreen() {
  return (
    <ScreenContainer scrollable>
      <HomeHeader />

      <View style={styles.content}>
        <UpcomingCard count={0} delay={100} />
        <GroupsSection delay={300} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 32,
  },
});
