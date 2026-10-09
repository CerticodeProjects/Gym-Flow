import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ChevronRight } from '../icons';
import { PercentRing } from '../PercentRing';
import { typography, spacing } from '../../theme';

interface DailyNutritionHeroProps {
  nutritionConsumed: number;
  nutritionTarget: number;
  nutritionPercentage: number;
  onViewDetails: () => void;
}

export const DailyNutritionHero: React.FC<DailyNutritionHeroProps> = ({
  nutritionConsumed,
  nutritionTarget,
  nutritionPercentage,
  onViewDetails,
}) => {
  const caloriesLeft = Math.max(0, nutritionTarget - nutritionConsumed);

  return (
    <View style={styles.nutritionCard}>
      {/* Left Side: Ring showing calories remaining */}
      <View style={styles.nutritionRingWrapper}>
        <PercentRing
          percentage={nutritionPercentage}
          size={130}
          strokeWidth={10}
          showPercentageText={false}
          color="#30D158"
          trackColor="rgba(48, 209, 88, 0.15)"
          textColor="#FFFFFF"
        />
        {/* Overlay: remaining calories + LEFT label */}
        <View style={styles.nutritionRingOverlay}>
          <Text style={styles.nutritionRingCalories}>
            {caloriesLeft.toLocaleString()}
          </Text>
          <Text style={styles.nutritionRingLabel}>LEFT</Text>
        </View>
      </View>

      {/* Right Side: Title, stats, white View Details button */}
      <View style={styles.nutritionRightContent}>
        <Text style={styles.nutritionTitle}>Daily Nutrition</Text>

        <View style={styles.nutritionStatsList}>
          <View style={styles.nutritionStatRow}>
            <Text style={styles.nutritionStatLabel}>Consumed:</Text>
            <Text style={styles.nutritionStatValue}>
              {nutritionConsumed === 0 ? '0 cal' : `${nutritionConsumed.toLocaleString()} cal`}
            </Text>
          </View>
          <View style={styles.nutritionStatRow}>
            <Text style={styles.nutritionStatLabel}>Intake:</Text>
            <Text style={styles.nutritionStatValue}>
              {nutritionTarget.toLocaleString()} cal
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.nutritionDetailsBtn}
          onPress={onViewDetails}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="View Daily Nutrition Details"
        >
          <Text style={styles.nutritionDetailsBtnText}>View Details</Text>
          <ChevronRight size={14} color="#000000" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  nutritionCard: {
    flexDirection: 'row',
    backgroundColor: Platform.OS === 'web' ? 'rgba(14, 14, 18, 0.65)' : 'rgba(16, 16, 22, 0.78)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.22)',
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: 'center',
    marginBottom: spacing.lg,
    gap: 20,
    minHeight: 160,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 8,
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(20px) saturate(190%)',
          WebkitBackdropFilter: 'blur(20px) saturate(190%)',
        } as any)
      : {}),
  },
  nutritionRingWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  nutritionRingOverlay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nutritionRingCalories: {
    fontFamily: typography.fonts.headingBold,
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -1,
    lineHeight: 34,
    textAlign: 'center',
  },
  nutritionRingLabel: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
    letterSpacing: 1.5,
    marginTop: 3,
    textAlign: 'center',
  },
  nutritionRightContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  nutritionTitle: {
    fontFamily: typography.fonts.headingBold,
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  nutritionStatsList: {
    marginBottom: 14,
    gap: 6,
  },
  nutritionStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nutritionStatLabel: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '400',
  },
  nutritionStatValue: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  nutritionDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 4,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  nutritionDetailsBtnText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
  },
});
