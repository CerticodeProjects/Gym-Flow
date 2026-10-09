import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { CheckCircle2 } from '../icons';

const APPLE_FONT_FAMILY =
  Platform.OS === 'web'
    ? '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif'
    : Platform.OS === 'ios'
    ? 'System'
    : 'Roboto';

interface AppleSelectionCardProps {
  isSelected: boolean;
  onPress: () => void;
  icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  title: string;
  subtitle: string;
  tag?: string;
  index: number;
  stepKey: number;
}

export const AppleSelectionCard: React.FC<AppleSelectionCardProps> = ({
  isSelected,
  onPress,
  icon: IconComponent,
  title,
  subtitle,
  tag,
  index,
  stepKey,
}) => {
  const pressScale = useRef(new Animated.Value(1)).current;
  const entranceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    entranceAnim.setValue(0);
    const timer = setTimeout(() => {
      Animated.timing(entranceAnim, {
        toValue: 1,
        duration: 280,
        easing: Easing.bezier(0.32, 0.72, 0, 1),
        useNativeDriver: true,
      }).start();
    }, 50 * (index + 1));
    return () => clearTimeout(timer);
  }, [stepKey, index, entranceAnim]);

  const handlePressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.97,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const translateY = entranceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  return (
    <Animated.View
      style={{
        opacity: entranceAnim,
        transform: [{ translateY }, { scale: pressScale }],
      }}
    >
      <TouchableOpacity
        style={[styles.optionCard, isSelected && styles.optionCardSelected]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        <View style={styles.optionIconBox}>
          <IconComponent size={22} color="rgba(255, 255, 255, 0.6)" strokeWidth={2} />
        </View>
        <View style={styles.optionContent}>
          <View style={styles.optionHeaderRow}>
            <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
              {title}
            </Text>
            {tag ? (
              <View style={[styles.tagBadge, isSelected && styles.tagBadgeSelected]}>
                <Text style={[styles.tagBadgeText, isSelected && styles.tagBadgeTextSelected]}>
                  {tag}
                </Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.optionSubtitle}>{subtitle}</Text>
        </View>
        <View style={styles.checkCircleWrapper}>
          {isSelected ? (
            <CheckCircle2 size={22} color="#007AFF" />
          ) : (
            <View style={styles.unselectedRing} />
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        } as any)
      : {}),
  },
  optionCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.12)',
  },
  optionIconBox: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  optionContent: {
    flex: 1,
  },
  optionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionTitle: {
    fontFamily: APPLE_FONT_FAMILY,
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  optionTitleSelected: {
    color: '#FFFFFF',
  },
  tagBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  tagBadgeSelected: {
    backgroundColor: 'rgba(0, 122, 255, 0.25)',
  },
  tagBadgeText: {
    fontFamily: APPLE_FONT_FAMILY,
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.65)',
    letterSpacing: 0.2,
  },
  tagBadgeTextSelected: {
    color: '#007AFF',
  },
  optionSubtitle: {
    fontFamily: APPLE_FONT_FAMILY,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 3,
    lineHeight: 18,
  },
  checkCircleWrapper: {
    marginLeft: 12,
  },
  unselectedRing: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});
