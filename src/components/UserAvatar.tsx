import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme/colors';

type UserAvatarProps = {
  name?: string | null;
  email?: string | null;
  size?: number;
  imageUrl?: string | null;
};

function getInitials(name?: string | null, email?: string | null): string {
  const trimmedName = name?.trim();
  if (trimmedName) {
    const parts = trimmedName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  }

  const trimmedEmail = email?.trim();
  if (trimmedEmail) {
    return trimmedEmail[0].toUpperCase();
  }

  return 'U';
}

export function UserAvatar({ name, email, size = 56, imageUrl }: UserAvatarProps) {
  const initials = getInitials(name, email);
  const fontSize = Math.round(size * 0.36);
  const displayName = name?.trim() || email?.split('@')[0] || 'User';

  if (imageUrl) {
    return (
      <Image
        accessibilityLabel={`Avatar for ${displayName}`}
        source={{ uri: imageUrl }}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      />
    );
  }

  return (
    <View
      accessibilityLabel={`Avatar for ${displayName}`}
      style={[
        styles.placeholder,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentMuted,
    borderWidth: 1.5,
    borderColor: colors.accentBorder,
  },
  initials: {
    color: colors.text,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  image: {
    borderWidth: 1.5,
    borderColor: colors.accentBorder,
  },
});
