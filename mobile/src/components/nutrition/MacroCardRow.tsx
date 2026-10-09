import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HeartPulse, Leaf, Droplet } from '../icons';

interface MacroCardRowProps {
  totalProtein: number;
  proteinGoal: number;
  proteinPct: number;
  totalCarbs: number;
  carbsGoal: number;
  carbsPct: number;
  totalFat: number;
  fatGoal: number;
  fatPct: number;
}

const formatMacroValue = (val: number): string => {
  if (val === 0) return '0g';
  return Number.isInteger(val) ? `${val}g` : `${val.toFixed(1)}g`;
};

export const MacroCardRow: React.FC<MacroCardRowProps> = ({
  totalProtein,
  proteinGoal,
  proteinPct,
  totalCarbs,
  carbsGoal,
  carbsPct,
  totalFat,
  fatGoal,
  fatPct,
}) => {
  return (
    <View style={styles.macroCardsRow}>
      {/* Protein Card */}
      <View style={styles.macroCard}>
        <View style={styles.macroTopRow}>
          <HeartPulse size={18} color="#8E8E93" strokeWidth={2} />
          <Text style={styles.macroPercentageText}>{proteinPct}%</Text>
        </View>
        <Text style={styles.macroValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
          {formatMacroValue(totalProtein)}
        </Text>
        <Text style={styles.macroLabel}>Protein</Text>
        <Text style={styles.macroGoalText}>of {proteinGoal}g</Text>
        <View style={styles.macroTrack}>
          <View
            style={[
              styles.macroFill,
              { backgroundColor: '#FF375F', width: `${Math.min(100, Math.max(2, proteinPct))}%` },
            ]}
          />
        </View>
      </View>

      {/* Carbs Card */}
      <View style={styles.macroCard}>
        <View style={styles.macroTopRow}>
          <Leaf size={18} color="#8E8E93" strokeWidth={2} />
          <Text style={styles.macroPercentageText}>{carbsPct}%</Text>
        </View>
        <Text style={styles.macroValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
          {formatMacroValue(totalCarbs)}
        </Text>
        <Text style={styles.macroLabel}>Carbs</Text>
        <Text style={styles.macroGoalText}>of {carbsGoal}g</Text>
        <View style={styles.macroTrack}>
          <View
            style={[
              styles.macroFill,
              { backgroundColor: '#0A84FF', width: `${Math.min(100, Math.max(2, carbsPct))}%` },
            ]}
          />
        </View>
      </View>

      {/* Fats Card */}
      <View style={styles.macroCard}>
        <View style={styles.macroTopRow}>
          <Droplet size={18} color="#8E8E93" strokeWidth={2} />
          <Text style={styles.macroPercentageText}>{fatPct}%</Text>
        </View>
        <Text style={styles.macroValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
          {formatMacroValue(totalFat)}
        </Text>
        <Text style={styles.macroLabel}>Fats</Text>
        <Text style={styles.macroGoalText}>of {fatGoal}g</Text>
        <View style={styles.macroTrack}>
          <View
            style={[
              styles.macroFill,
              { backgroundColor: '#FF9F0A', width: `${Math.min(100, Math.max(2, fatPct))}%` },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  macroCardsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  macroCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  macroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  macroPercentageText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.65)',
  },
  macroValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  macroLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  macroGoalText: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.45)',
    marginBottom: 10,
  },
  macroTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    width: '100%',
  },
  macroFill: {
    height: '100%',
    borderRadius: 2,
  },
});
