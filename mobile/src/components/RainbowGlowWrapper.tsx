import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Platform, ViewStyle } from 'react-native';

interface RainbowGlowWrapperProps {
  active: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  borderRadius?: number;
}

// Global flag to inject web CSS keyframes once
let webStylesInjected = false;
function ensureWebKeyframes() {
  if (Platform.OS !== 'web' || typeof document === 'undefined' || webStylesInjected) return;
  webStylesInjected = true;

  const styleEl = document.createElement('style');
  styleEl.id = 'ai-glow-keyframes';
  styleEl.textContent = `
    @keyframes aiGlowShift {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
    @keyframes aiGlowPulse {
      0%, 100% {
        opacity: 0.72;
        transform: scale(1.0);
      }
      50% {
        opacity: 0.95;
        transform: scale(1.012);
      }
    }
  `;
  document.head.appendChild(styleEl);
}

const AI_GRADIENT =
  'linear-gradient(120deg, #00F0FF 0%, #6366F1 24%, #EC4899 48%, #8B5CF6 72%, #38BDF8 88%, #00F0FF 100%)';

export const RainbowGlowWrapper: React.FC<RainbowGlowWrapperProps> = ({
  active,
  children,
  style,
  borderRadius = 28,
}) => {
  const colorAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    ensureWebKeyframes();
  }, []);

  useEffect(() => {
    if (active) {
      // Loop AI glow colors continuously
      const colorLoop = Animated.loop(
        Animated.timing(colorAnim, {
          toValue: 1,
          duration: 3200,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      );

      // Soft breathing glow
      const pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1100,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 1100,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      );

      colorLoop.start();
      pulseLoop.start();

      return () => {
        colorLoop.stop();
        pulseLoop.stop();
        colorAnim.setValue(0);
        pulseAnim.setValue(0);
      };
    } else {
      colorAnim.setValue(0);
      pulseAnim.setValue(0);
    }
  }, [active, colorAnim, pulseAnim]);

  // Apple Intelligence AI color spectrum interpolation for native platforms
  const animatedRainbowColor = colorAnim.interpolate({
    inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
    outputRange: [
      '#00F0FF', // Electric Cyan
      '#6366F1', // Indigo
      '#EC4899', // Hot Pink
      '#8B5CF6', // Electric Violet
      '#38BDF8', // Sky Blue
      '#00F0FF', // Cyan Loop
    ],
  });

  const animatedShadowRadius = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 20],
  });

  const animatedShadowOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.65, 0.95],
  });

  // On Web, use hardware-accelerated CSS animated gradient border overlay
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.wrapper, style]}>
        {/* Outer Radiant Glow Halo (purely visual overlay, pointerEvents: none, zero size impact) */}
        {active && (
          <div
            style={{
              position: 'absolute',
              top: -4,
              left: -4,
              right: -4,
              bottom: -4,
              borderRadius: borderRadius + 4,
              background: AI_GRADIENT,
              backgroundSize: '240% 240%',
              animation: 'aiGlowShift 3.2s ease-in-out infinite, aiGlowPulse 2.2s ease-in-out infinite',
              filter: 'blur(12px)',
              opacity: 0.85,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        )}

        {/* Crisp Animated Gradient Border Layer (purely visual overlay, pointerEvents: none, zero size impact) */}
        {active && (
          <div
            style={{
              position: 'absolute',
              top: -1,
              left: -1,
              right: -1,
              bottom: -1,
              borderRadius: borderRadius + 1,
              background: AI_GRADIENT,
              backgroundSize: '240% 240%',
              animation: 'aiGlowShift 3.2s ease-in-out infinite',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />
        )}

        {/* Content Container (consistent container structure prevents any layout or size jump) */}
        <View
          style={[
            styles.innerContent,
            {
              borderRadius,
              backgroundColor: active ? 'rgba(14, 14, 18, 0.94)' : 'transparent',
              zIndex: 2,
            },
          ]}
        >
          {children}
        </View>
      </View>
    );
  }

  // On Native (iOS / Android)
  return (
    <Animated.View
      style={[
        styles.wrapper,
        active && {
          borderRadius,
          shadowColor: animatedRainbowColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: animatedShadowOpacity,
          shadowRadius: animatedShadowRadius,
          elevation: 12,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.innerContent,
          {
            borderRadius,
            backgroundColor: active ? 'rgba(14, 14, 18, 0.94)' : 'transparent',
          },
        ]}
      >
        {children}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    width: '100%',
  },
  innerContent: {
    width: '100%',
  },
});
