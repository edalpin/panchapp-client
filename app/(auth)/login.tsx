import { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { getAuthErrorMessage, useAuth } from '../../src/auth/AuthProvider';
import { hasGoogleRedirectCallback } from '../../src/auth/googleSignIn';
import { AnimatedEntrance } from '../../src/components/AnimatedEntrance';
import { GoogleSignInButton } from '../../src/components/GoogleSignInButton';
import { colors } from '../../src/theme/colors';

export default function LoginScreen() {
  const { isSigningIn, signInWithGoogle } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const floatY = useSharedValue(0);

  const handleSignIn = useCallback(async () => {
    setErrorMessage(null);

    try {
      await signInWithGoogle();
    } catch (error) {
      const message = getAuthErrorMessage(error);

      if (message) {
        setErrorMessage(message);
      }
    }
  }, [signInWithGoogle]);

  useEffect(() => {
    if (!hasGoogleRedirectCallback()) {
      return;
    }

    void signInWithGoogle().catch((error) => {
      const message = getAuthErrorMessage(error);

      if (message) {
        setErrorMessage(message);
      }
    });
  }, [signInWithGoogle]);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2200, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [floatY]);

  const logoFloatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#000000', '#111827', '#000000']}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFill}
      />

      <Image
        accessibilityElementsHidden
        importantForAccessibility="no"
        source={require('../../assets/logo.png')}
        style={styles.watermark}
      />

      <View
        style={[
          styles.container,
          { paddingBottom: Math.max(insets.bottom, 24), paddingTop: insets.top + 40 },
        ]}
      >
        <View style={styles.hero}>
          <AnimatedEntrance delay={0}>
            <Animated.View style={[styles.logoShadow, logoFloatStyle]}>
              <Image
                accessibilityIgnoresInvertColors
                source={require('../../assets/logo.png')}
                style={styles.logo}
              />
            </Animated.View>
          </AnimatedEntrance>

          <AnimatedEntrance delay={120}>
            <Text style={styles.title}>Panchapp</Text>
          </AnimatedEntrance>

          <AnimatedEntrance delay={220}>
            <Text style={styles.tagline}>Elevate your events, simplify your planning.</Text>
          </AnimatedEntrance>
        </View>

        <AnimatedEntrance delay={340} style={styles.cardWrap}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome to Panchapp</Text>
            <Text style={styles.cardSubtitle}>
              Sign in to start creating memorable experiences.
            </Text>

            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Text style={styles.error}>{errorMessage}</Text>
              </View>
            ) : null}

            <GoogleSignInButton loading={isSigningIn} onPress={handleSignIn} />
          </View>
        </AnimatedEntrance>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.darkBg,
  },
  watermark: {
    bottom: -60,
    height: 380,
    opacity: 0.03,
    position: 'absolute',
    right: -80,
    transform: [{ rotate: '-15deg' }],
    width: 380,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 32,
  },
  hero: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40,
  },
  logoShadow: {
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { height: 20, width: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 10,
  },
  logo: {
    borderRadius: 40,
    height: 140,
    width: 140,
  },
  title: {
    color: colors.darkText,
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 12,
    textAlign: 'center',
  },
  tagline: {
    color: colors.darkTextMuted,
    fontSize: 18,
    lineHeight: 26,
    maxWidth: 300,
    textAlign: 'center',
    fontWeight: '500',
  },
  cardWrap: {
    width: '100%',
  },
  card: {
    backgroundColor: colors.darkSurface,
    borderColor: colors.darkBorder,
    borderRadius: 32,
    borderWidth: 1,
    gap: 20,
    paddingHorizontal: 28,
    paddingVertical: 32,
    shadowColor: '#000',
    shadowOffset: { height: 12, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 20,
  },
  cardTitle: {
    color: colors.darkText,
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
  },
  cardSubtitle: {
    color: colors.darkTextMuted,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorBanner: {
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.2)',
  },
  error: {
    color: '#f87171',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
