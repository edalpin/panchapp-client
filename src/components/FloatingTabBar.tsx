import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { BottomTabBarProps } from 'expo-router/tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, gradients } from '@/theme/colors';

const FLOAT_OFFSET = 20;
const ICON_SIZE = 22;

const TAB_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  home: 'home-sharp',
  groups: 'people-sharp',
};

type TabButtonProps = {
  accessibilityLabel: string;
  focused: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  onLongPress: () => void;
  onPress: () => void;
};

function TabButton({ accessibilityLabel, focused, icon, onLongPress, onPress }: TabButtonProps) {
  const iconElement = (
    <Ionicons color={focused ? colors.onPrimary : colors.textMuted} name={icon} size={ICON_SIZE} />
  );

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={focused ? { selected: true } : {}}
      onLongPress={onLongPress}
      onPress={onPress}
      style={styles.tab}
    >
      {focused ? (
        <LinearGradient
          colors={[...gradients.primaryButton]}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
          style={[styles.tabSlot, styles.activePill]}
        >
          {iconElement}
        </LinearGradient>
      ) : (
        <View style={styles.tabSlot}>{iconElement}</View>
      )}
    </Pressable>
  );
}

export function FloatingTabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  return (
    <View style={[styles.container, { bottom: insets.bottom + FLOAT_OFFSET }]}>
      {state.routes.map((route, index) => {
        const icon = TAB_ICONS[route.name];
        if (!icon) {
          return null;
        }

        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const accessibilityLabel = options.tabBarAccessibilityLabel ?? options.title ?? route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabButton
            key={route.key}
            accessibilityLabel={accessibilityLabel}
            focused={focused}
            icon={icon}
            onLongPress={onLongPress}
            onPress={onPress}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 56,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabSlot: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    width: 64,
  },
  activePill: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: colors.shadow,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
});
