import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  Dumbbell,
  Calendar as CalendarIcon,
  TrendingUp,
  Droplets,
  Salad,
  Sparkles,
} from '../icons';
import { colors, typography, spacing } from '../../theme';

interface FeaturesGridProps {
  isProfileComplete: boolean;
  onNavigateWorkout: () => void;
  onNavigateMyPlan: () => void;
  onNavigateProgress: () => void;
  onNavigateWater: () => void;
  onNavigateNutrition: () => void;
  onNavigateAiCoach: () => void;
  onProfileRequired: (featureName: string) => void;
}

export const FeaturesGrid: React.FC<FeaturesGridProps> = ({
  isProfileComplete,
  onNavigateWorkout,
  onNavigateMyPlan,
  onNavigateProgress,
  onNavigateWater,
  onNavigateNutrition,
  onNavigateAiCoach,
  onProfileRequired,
}) => {
  const triggerHaptic = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  };

  const handleWaterPress = () => {
    triggerHaptic();
    if (!isProfileComplete) {
      onProfileRequired('Water Tracker');
      return;
    }
    onNavigateWater();
  };

  const handleNutritionPress = () => {
    triggerHaptic();
    if (!isProfileComplete) {
      onProfileRequired('Nutrition Tracker');
      return;
    }
    onNavigateNutrition();
  };

  return (
    <View>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Features</Text>
      </View>

      <View style={styles.quickActionsRow}>
        {/* Card 1: Workout */}
        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => {
            triggerHaptic();
            onNavigateWorkout();
          }}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Workout quick action"
        >
          <Dumbbell size={26} color="#FF453A" style={styles.quickActionIcon} />
          <Text style={styles.quickActionTitle}>Workout</Text>
          <Text style={styles.quickActionSubtitle}>Routines</Text>
        </TouchableOpacity>

        {/* Card 2: My Plan */}
        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => {
            triggerHaptic();
            onNavigateMyPlan();
          }}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="My Plan quick action"
        >
          <CalendarIcon size={26} color="#FF2D55" style={styles.quickActionIcon} />
          <Text style={styles.quickActionTitle}>My Plan</Text>
          <Text style={styles.quickActionSubtitle}>Schedule</Text>
        </TouchableOpacity>

        {/* Card 3: Progress */}
        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => {
            triggerHaptic();
            onNavigateProgress();
          }}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Progress quick action"
        >
          <TrendingUp size={26} color="#FF9500" style={styles.quickActionIcon} />
          <Text style={styles.quickActionTitle}>Progress</Text>
          <Text style={styles.quickActionSubtitle}>Analytics</Text>
        </TouchableOpacity>

        {/* Card 4: Water */}
        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={handleWaterPress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Water Tracker quick action"
        >
          <Droplets size={26} color="#00E5FF" style={styles.quickActionIcon} />
          <Text style={styles.quickActionTitle}>Water</Text>
          <Text style={styles.quickActionSubtitle}>Tracker</Text>
        </TouchableOpacity>

        {/* Card 5: Nutrition */}
        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={handleNutritionPress}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Nutrition quick action"
        >
          <Salad size={26} color="#30D158" style={styles.quickActionIcon} />
          <Text style={styles.quickActionTitle}>Nutrition</Text>
          <Text style={styles.quickActionSubtitle}>Log Food</Text>
        </TouchableOpacity>

        {/* Card 6: AI Coach */}
        <TouchableOpacity
          style={styles.quickActionCard}
          onPress={() => {
            triggerHaptic();
            onNavigateAiCoach();
          }}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="AI Coach quick action"
        >
          <Sparkles size={26} color="#BF5AF2" style={styles.quickActionIcon} />
          <Text style={styles.quickActionTitle}>AI Coach</Text>
          <Text style={styles.quickActionSubtitle}>Assistant</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontFamily: typography.fonts.headingBold,
    fontSize: typography.sizes.lg,
    color: colors.text,
  },
  quickActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  quickActionCard: {
    flexBasis: '30%',
    flexGrow: 1,
    flexShrink: 0,
    backgroundColor: Platform.OS === 'web' ? 'rgba(14, 14, 18, 0.65)' : 'rgba(16, 16, 22, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 6,
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(20px) saturate(190%)',
          WebkitBackdropFilter: 'blur(20px) saturate(190%)',
        } as any)
      : {}),
  },
  quickActionIcon: {
    marginBottom: 8,
  },
  quickActionTitle: {
    fontFamily: typography.fonts.headingBold,
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  quickActionSubtitle: {
    fontFamily: typography.fonts.body,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.65)',
    textAlign: 'center',
    marginTop: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
