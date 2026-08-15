import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/features/auth/context/AuthProvider';
import { colors } from '@/theme/colors';

export function HamburgerMenu() {
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const closeMenu = () => {
    setOpen(false);
  };

  const handleSignOut = () => {
    closeMenu();
    void signOut();
  };

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityLabel="Open menu"
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => {
          setOpen((current) => !current);
        }}
        style={({ pressed }) => [styles.trigger, pressed && styles.triggerPressed]}
      >
        <Ionicons color={colors.text} name="menu-outline" size={24} />
      </Pressable>

      {open ? (
        <>
          <Pressable
            accessibilityLabel="Close menu"
            accessibilityRole="button"
            onPress={closeMenu}
            style={styles.backdrop}
          />
          <View style={styles.dropdown}>
            <Pressable
              accessibilityRole="button"
              onPress={handleSignOut}
              style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
            >
              <Ionicons color={colors.textMuted} name="log-out-outline" size={18} />
              <Text style={styles.menuItemLabel}>Sign out</Text>
            </Pressable>
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 10,
  },
  trigger: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  triggerPressed: {
    backgroundColor: colors.border,
    transform: [{ scale: 0.96 }],
  },
  backdrop: {
    position: 'fixed' as 'absolute',
    top: -1000,
    right: -1000,
    bottom: -1000,
    left: -1000,
    zIndex: 1,
  },
  dropdown: {
    position: 'absolute',
    top: 48,
    right: 0,
    minWidth: 160,
    backgroundColor: colors.surfaceElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingVertical: 6,
    zIndex: 2,
    shadowColor: colors.background,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemPressed: {
    backgroundColor: colors.glass,
  },
  menuItemLabel: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '600',
  },
});
