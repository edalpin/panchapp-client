import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

type UpcomingCardProps = {
  count: number;
  delay?: number;
};

export function UpcomingCard({ count, delay = 0 }: UpcomingCardProps) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(600)}>
      <LinearGradient
        colors={['#3b82f6', '#06b6d4']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.label}>Upcoming Plans</Text>
          <View style={styles.countContainer}>
            <Text style={styles.countText}>{count}</Text>
            <Text style={styles.countSubtext}>active</Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 32,
    padding: 24,
    minHeight: 180,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  label: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  countText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '800',
  },
  countSubtext: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    opacity: 0.9,
  },
});
