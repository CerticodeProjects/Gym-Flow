import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Flame, Salad, HeartPulse, Leaf, Plus } from '../icons';

export const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'] as const;
export type MealType = (typeof MEAL_TYPES)[number];

interface MealBreakdownData {
  count: number;
  calories: number;
  entries: any[];
}

interface MealsBreakdownCardProps {
  mealBreakdown: Record<MealType, MealBreakdownData>;
  onAddMeal: (meal: MealType) => void;
}

export const MealsBreakdownCard: React.FC<MealsBreakdownCardProps> = ({
  mealBreakdown,
  onAddMeal,
}) => {
  return (
    <View>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeaderTitle}>MEALS TODAY</Text>
      </View>
      <View style={styles.insetGroupedCard}>
        {MEAL_TYPES.map((meal, index) => {
          const data = mealBreakdown[meal];
          const isLast = index === MEAL_TYPES.length - 1;
          const renderMealIcon = () => {
            switch (meal) {
              case 'Breakfast':
                return <Flame size={18} color="#8E8E93" strokeWidth={2} />;
              case 'Lunch':
                return <Salad size={18} color="#8E8E93" strokeWidth={2} />;
              case 'Dinner':
                return <HeartPulse size={18} color="#8E8E93" strokeWidth={2} />;
              case 'Snacks':
                return <Leaf size={18} color="#8E8E93" strokeWidth={2} />;
            }
          };

          return (
            <View key={meal}>
              <View style={styles.mealRow}>
                <View style={styles.mealLeft}>
                  {renderMealIcon()}
                  <View>
                    <Text style={styles.mealName}>{meal}</Text>
                    <Text style={styles.mealMeta}>
                      {data.count > 0 ? `${data.count} ${data.count === 1 ? 'item' : 'items'}` : 'Not logged'}
                    </Text>
                  </View>
                </View>

                <View style={styles.mealRight}>
                  <Text style={[styles.mealCaloriesText, data.calories > 0 && styles.mealCaloriesActive]}>
                    {data.calories > 0 ? `${data.calories} kcal` : '—'}
                  </Text>
                  <TouchableOpacity
                    style={styles.mealAddBtn}
                    onPress={() => onAddMeal(meal)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityRole="button"
                    accessibilityLabel={`Add food to ${meal}`}
                  >
                    <Plus size={16} color="#FFFFFF" strokeWidth={2.4} />
                  </TouchableOpacity>
                </View>
              </View>
              {!isLast && <View style={styles.rowDivider} />}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 6,
    paddingHorizontal: 4,
  },
  sectionHeaderTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  insetGroupedCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
    marginBottom: 22,
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  mealLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mealName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  mealMeta: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.45)',
    marginTop: 1,
  },
  mealRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  mealCaloriesText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  mealCaloriesActive: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
  mealAddBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginLeft: 46,
  },
});
