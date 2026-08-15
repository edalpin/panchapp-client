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
import { Ionicons } from '@expo/vector-icons';
import { AnimatedEntrance } from '@/components/AnimatedEntrance';
import { colors, gradients } from '@/theme/colors';
import { getAuthErrorMessage, useAuth } from '@/features/auth/context/AuthProvider';
import { GoogleSignInButton } from '@/features/auth/components/GoogleSignInButton';

export function LoginScreen() {
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
    floatY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
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
      <LinearGradient colors={[...gradients.background]} style={StyleSheet.absoluteFill} />

      <View style={[StyleSheet.absoluteFill, styles.ringsContainer]}>
        <View style={[styles.ring, styles.ringSmall]} />
        <View style={[styles.ring, styles.ringMedium]} />
        <View style={[styles.ring, styles.ringLarge]} />

        <View style={[styles.iconOnRing, { top: '35%', left: '15%' }]}>
          <View style={styles.iconCircle}>
            <Ionicons name="calendar" size={16} color={colors.accent} />
          </View>
        </View>
        <View style={[styles.iconOnRing, { top: '25%', right: '20%' }]}>
          <View style={styles.iconCircle}>
            <Ionicons name="ticket" size={16} color={colors.accent} />
          </View>
        </View>
        <View style={[styles.iconOnRing, { bottom: '45%', right: '10%' }]}>
          <View style={styles.iconCircle}>
            <Ionicons name="location" size={16} color={colors.accent} />
          </View>
        </View>
        <View style={[styles.iconOnRing, { bottom: '40%', left: '8%' }]}>
          <View style={styles.iconCircle}>
            <Ionicons name="people" size={16} color={colors.accent} />
          </View>
        </View>
      </View>

      <View
        style={[
          styles.container,
          { paddingBottom: Math.max(insets.bottom, 24), paddingTop: insets.top + 20 },
        ]}
      >
        <View style={styles.hero}>
          <AnimatedEntrance delay={200}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Welcome to</Text>
              <Text style={styles.logoName}>Panchapp</Text>
              <Text style={styles.tagline}>Panchi-activities</Text>
            </View>
          </AnimatedEntrance>

          <AnimatedEntrance delay={400}>
            <Animated.View style={[styles.logoContainer, logoFloatStyle]}>
              <View style={styles.logoOuter}>
                <View style={styles.logoInner}>
                  <Image
                    accessibilityIgnoresInvertColors
                    source={require('../../../../assets/logo.png')}
                    style={styles.logo}
                  />
                </View>
              </View>
            </Animated.View>
          </AnimatedEntrance>
        </View>

        <View style={styles.footer}>
          {errorMessage ? (
            <AnimatedEntrance delay={0}>
              <View style={styles.errorBanner}>
                <Ionicons
                  name="alert-circle"
                  size={18}
                  color={colors.error}
                  style={styles.errorIcon}
                />
                <Text style={styles.error}>{errorMessage}</Text>
              </View>
            </AnimatedEntrance>
          ) : null}

          <AnimatedEntrance delay={600}>
            <GoogleSignInButton loading={isSigningIn} onPress={handleSignIn} />
          </AnimatedEntrance>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  ringsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.ring,
    aspectRatio: 1,
  },
  ringSmall: {
    width: '60%',
    opacity: 0.1,
  },
  ringMedium: {
    width: '85%',
    opacity: 0.07,
  },
  ringLarge: {
    width: '110%',
    opacity: 0.04,
  },
  iconOnRing: {
    position: 'absolute',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.accentMuted,
    borderWidth: 1,
    borderColor: colors.accentBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
  },
  logoName: {
    color: colors.accent,
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 1,
  },
  hero: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '400',
    textAlign: 'center',
  },
  tagline: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoOuter: {
    width: 220,
    height: 280,
    borderRadius: 30,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInner: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: colors.glassInner,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  footer: {
    width: '100%',
    paddingBottom: 20,
  },
  errorBanner: {
    backgroundColor: colors.errorSurface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  errorIcon: {
    marginRight: 8,
  },
  error: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
});
