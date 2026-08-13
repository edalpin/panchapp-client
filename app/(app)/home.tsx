import { useQuery } from '@apollo/client/react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/auth/AuthProvider';
import { ME, type MeQuery } from '../../src/graphql/operations/auth';

export default function HomeScreen() {
  const { signOut, user } = useAuth();
  const { data, loading } = useQuery<MeQuery>(ME);
  const displayUser = data?.me ?? user;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome{displayUser?.name ? `, ${displayUser.name}` : ''}</Text>
      <Text style={styles.email}>{displayUser?.email ?? (loading ? 'Loading…' : '')}</Text>

      <Pressable
        accessibilityRole="button"
        onPress={() => {
          void signOut();
        }}
        style={({ pressed }) => [styles.signOutButton, pressed && styles.signOutButtonPressed]}
      >
        <Text style={styles.signOutLabel}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  email: {
    color: '#666',
    fontSize: 16,
    marginBottom: 16,
  },
  signOutButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderColor: '#ccc',
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  signOutButtonPressed: {
    opacity: 0.75,
  },
  signOutLabel: {
    color: '#111',
    fontSize: 16,
    fontWeight: '600',
  },
});
