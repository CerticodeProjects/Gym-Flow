import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { PercentRing } from '../PercentRing';

interface CalorieActivityRingProps {
  totalCalories: number;
  dailyTarget: number;
  caloriesPct: number;
}

export const CalorieActivityRing: React.FC<CalorieActivityRingProps> = ({
  totalCalories,
  dailyTarget,
  caloriesPct,
}) => {
  return (
    <View style={styles.heroCard}>
      <View style={styles.ringContainer}>
        <PercentRing
          percentage={caloriesPct}
          size={196}
          strokeWidth={17}
          color="#30D158"
          trackColor="rgba(48, 209, 88, 0.12)"
          showPercentageText={false}
        >
          <View style={styles.circleInnerContent}>
            <Text style={styles.circleCaloriesNumber}>{totalCalories.toLocaleString()}</Text>
            <Text style={styles.circleCaloriesUnit}>KCAL</Text>
            <Text style={styles.circleCaloriesTarget}>of {dailyTarget.toLocaleString()} kcal</Text>
          </View>
        </PercentRing>
      </View>

      <View style={styles.heroDivider} />

      <View style={styles.heroStatsRow}>
        <View style={styles.heroStatItem}>
          <Text style={styles.heroStatLabel}>REMAINING</Text>
          <Text style={styles.heroStatValue}>
            {Math.max(0, dailyTarget - totalCalories).toLocaleString()} <Text style={styles.heroStatUnit}>kcal</Text>
          </Text>
        </View>
        <View style={styles.heroStatDivider} />
        <View style={styles.heroStatItem}>
          <Text style={styles.heroStatLabel}>DAILY GOAL</Text>
          <Text style={styles.heroStatValue}>
            {dailyTarget.toLocaleString()} <Text style={styles.heroStatUnit}>kcal</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    paddingVertical: 20,
    paddingHorizontal: 18,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 3,
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        } as any)
      : {}),
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  circleInnerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleCaloriesNumber: {
    fontSize: 42,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 46,
    letterSpacing: -1,
  },
  circleCaloriesUnit: {
    fontSize: 12,
    fontWeight: '700',
    color: '#30D158',
    letterSpacing: 1.2,
    marginTop: 2,
  },
  circleCaloriesTarget: {
    fontSize: 12.5,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 4,
  },
  heroDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 14,
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  heroStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  heroStatDivider: {
    width: StyleSheet.hairlineWidth,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  heroStatLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: 'rgba(255, 255, 255, 0.45)',
    marginBottom: 3,
  },
  heroStatValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  heroStatUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.45)',
  },
});
