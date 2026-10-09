import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated, Easing, Platform } from 'react-native';

const APPLE_FONT_FAMILY =
  Platform.OS === 'web'
    ? '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif'
    : Platform.OS === 'ios'
    ? 'System'
    : 'Roboto';

interface StepTitleGroupProps {
  title: string;
  subtitle?: string;
  stepKey: number;
}

export const StepTitleGroup: React.FC<StepTitleGroupProps> = ({ title, subtitle, stepKey }) => {
  const entranceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    entranceAnim.setValue(0);
    Animated.timing(entranceAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.bezier(0.32, 0.72, 0, 1),
      useNativeDriver: true,
    }).start();
  }, [stepKey, entranceAnim]);

  const translateY = entranceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  return (
    <Animated.View
      style={[
        styles.centeredTitleGroup,
        {
          opacity: entranceAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      <Text style={styles.centeredStepTitle}>{title}</Text>
      {subtitle ? <Text style={styles.stepSubtitleText}>{subtitle}</Text> : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  centeredTitleGroup: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 28,
  },
  centeredStepTitle: {
    fontFamily: APPLE_FONT_FAMILY,
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.6,
    lineHeight: 38,
  },
  stepSubtitleText: {
    fontFamily: APPLE_FONT_FAMILY,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
});
