import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import * as Crypto from 'expo-crypto';
import { ChevronLeft, RotateCcw } from '../components/icons';
import { getDatabase } from '../db/connection';
import { useAuthStore } from '../store/authStore';
import { calculateDailyCalorieTarget } from '../utils/nutritionCalculator';
import {
  CalorieActivityRing,
  MacroCardRow,
  NutritionQuickActions,
  MealsBreakdownCard,
  LoggedFoodsList,
  ManualEntryModal,
  BarcodeChoiceModal,
  ProfileRequiredGate,
  MealType,
  NutritionEntryItem,
} from '../components/nutrition';

function localDateKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const DEFAULT_TARGET = 2000;

export const NutritionScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const user = useAuthStore((state) => state.user);
  const isProfileComplete = Boolean(user?.is_profile_completed);

  const [entries, setEntries] = useState<NutritionEntryItem[]>([]);
  const [dailyTarget, setDailyTarget] = useState(DEFAULT_TARGET);
  const [isLoading, setIsLoading] = useState(true);
  const [showManual, setShowManual] = useState(false);
  const [showBarcodeChoiceModal, setShowBarcodeChoiceModal] = useState(false);
  const [manualMealType, setManualMealType] = useState<MealType>('Snacks');

  const triggerHaptic = (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    try {
      Haptics.impactAsync(style);
    } catch {}
  };

  const formattedDate = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }, []);

  const loadData = useCallback(async () => {
    if (!isProfileComplete) {
      setIsLoading(false);
      return;
    }
    try {
      const db = await getDatabase();

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS NutritionEntry (
          id TEXT PRIMARY KEY NOT NULL,
          food_name TEXT NOT NULL,
          calories INTEGER NOT NULL,
          protein_g REAL NOT NULL,
          carbs_g REAL NOT NULL,
          fat_g REAL NOT NULL,
          serving_size TEXT,
          meal_type TEXT NOT NULL,
          source TEXT NOT NULL,
          logged_at TEXT NOT NULL,
          date_key TEXT NOT NULL,
          barcode TEXT,
          image_url TEXT
        );
      `);

      try {
        await db.execAsync('ALTER TABLE NutritionEntry ADD COLUMN barcode TEXT;');
      } catch {}
      try {
        await db.execAsync('ALTER TABLE NutritionEntry ADD COLUMN image_url TEXT;');
      } catch {}

      // Backfill missing images for known products already logged
      try {
        await db.runAsync(
          `UPDATE NutritionEntry
           SET image_url = 'https://images.openfoodfacts.org/images/products/880/107/311/4814/front_en.11.400.jpg'
           WHERE (image_url IS NULL OR image_url = '')
             AND (food_name LIKE '%Artificial Spicy Chicken%' OR food_name LIKE '%Buldak%' OR barcode = '8801073114814')`
        );
        await db.runAsync(
          `UPDATE NutritionEntry
           SET image_url = 'https://images.openfoodfacts.org/images/products/075/051/503/0206/front_en.3.400.jpg'
           WHERE (image_url IS NULL OR image_url = '')
             AND (food_name LIKE '%SkyFlakes%' OR food_name LIKE '%Sky flakes%')`
        );
      } catch {}

      const prefs = await db.getFirstAsync<{ daily_nutrition_target_calories: number | null; fitness_goal?: string | null }>(
        'SELECT daily_nutrition_target_calories, fitness_goal FROM Preferences WHERE id = ?',
        ['default']
      );

      if (prefs?.daily_nutrition_target_calories) {
        setDailyTarget(prefs.daily_nutrition_target_calories);
      } else if (user?.weight_kg && user?.height_cm) {
        const calculated = calculateDailyCalorieTarget({
          weightKg: user.weight_kg,
          heightCm: user.height_cm,
          gender: user.gender || 'male',
          birthdate: user.birthdate,
          fitnessGoal: user.fitness_goal || prefs?.fitness_goal || 'build_muscle',
        });
        setDailyTarget(calculated.targetCalories);
        try {
          await db.runAsync(
            `UPDATE Preferences SET daily_nutrition_target_calories = ? WHERE id = 'default'`,
            [calculated.targetCalories]
          );
        } catch {}
      }

      const currentKey = localDateKey();
      const rows = await db.getAllAsync<NutritionEntryItem>(
        `SELECT id, food_name, calories, protein_g, carbs_g, fat_g, serving_size, meal_type, source, logged_at, barcode, image_url
         FROM NutritionEntry WHERE date_key = ? ORDER BY logged_at DESC`,
        [currentKey]
      );
      setEntries(rows);
    } catch (err) {
      console.error('[Nutrition] loadData:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isProfileComplete, user]);

  useFocusEffect(
    useCallback(() => {
      if (!isProfileComplete) return;
      if (route.params?.openManualEntry) {
        setShowManual(true);
        navigation.setParams({ openManualEntry: undefined });
      }
      loadData();
    }, [isProfileComplete, loadData, route.params, navigation])
  );

  const totalCalories = entries.reduce((s, e) => s + e.calories, 0);
  const totalProtein = entries.reduce((s, e) => s + (e.protein_g ?? 0), 0);
  const totalCarbs = entries.reduce((s, e) => s + (e.carbs_g ?? 0), 0);
  const totalFat = entries.reduce((s, e) => s + (e.fat_g ?? 0), 0);
  const caloriesPct = Math.min((totalCalories / dailyTarget) * 100, 100);

  const macroGoals = useMemo(() => {
    if (user?.weight_kg && user?.height_cm) {
      const calculated = calculateDailyCalorieTarget({
        weightKg: user.weight_kg,
        heightCm: user.height_cm,
        gender: user.gender || 'male',
        birthdate: user.birthdate,
        fitnessGoal: user.fitness_goal || 'build_muscle',
      });
      return calculated.macros;
    }
    const pGrams = Math.round((dailyTarget * 0.3) / 4);
    const fGrams = Math.round((dailyTarget * 0.25) / 9);
    const cGrams = Math.max(0, Math.round((dailyTarget - pGrams * 4 - fGrams * 9) / 4));
    return {
      proteinGrams: pGrams || 150,
      carbsGrams: cGrams || 295,
      fatGrams: fGrams || 66,
    };
  }, [user?.weight_kg, user?.height_cm, user?.gender, user?.birthdate, user?.fitness_goal, dailyTarget]);

  const proteinPct = Math.round((totalProtein / (macroGoals.proteinGrams || 1)) * 100);
  const carbsPct = Math.round((totalCarbs / (macroGoals.carbsGrams || 1)) * 100);
  const fatPct = Math.round((totalFat / (macroGoals.fatGrams || 1)) * 100);

  const mealBreakdown = useMemo(() => {
    const result: Record<MealType, { count: number; calories: number; entries: NutritionEntryItem[] }> = {
      Breakfast: { count: 0, calories: 0, entries: [] },
      Lunch: { count: 0, calories: 0, entries: [] },
      Dinner: { count: 0, calories: 0, entries: [] },
      Snacks: { count: 0, calories: 0, entries: [] },
    };
    for (const entry of entries) {
      const meal = entry.meal_type as MealType;
      if (result[meal]) {
        result[meal].count += 1;
        result[meal].calories += entry.calories;
        result[meal].entries.push(entry);
      } else {
        result.Snacks.count += 1;
        result.Snacks.calories += entry.calories;
        result.Snacks.entries.push(entry);
      }
    }
    return result;
  }, [entries]);

  const deleteEntry = async (id: string) => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const db = await getDatabase();
      await db.runAsync('DELETE FROM NutritionEntry WHERE id = ?', [id]);
      setEntries((prev) => prev.filter((e) => e.id !== id));
      await loadData();
    } catch (err) {
      console.error('[Nutrition] delete:', err);
    }
  };

  const clearTodayEntries = async () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Reset Today's Nutrition",
      'Are you sure you want to clear all logged food entries for today? This will reset consumed calories to 0.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset to 0',
          style: 'destructive',
          onPress: async () => {
            try {
              const db = await getDatabase();
              const currentKey = localDateKey();
              await db.runAsync('DELETE FROM NutritionEntry WHERE date_key = ?', [currentKey]);
              setEntries([]);
              await loadData();
              try {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              } catch {}
            } catch (err) {
              console.error('[Nutrition] clearTodayEntries:', err);
            }
          },
        },
      ]
    );
  };

  const saveManualEntry = async (entry: {
    foodName: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    mealType: MealType;
  }) => {
    const db = await getDatabase();
    const id = Crypto.randomUUID();
    const now = new Date().toISOString();
    const currentKey = localDateKey();

    await db.runAsync(
      `INSERT INTO NutritionEntry
       (id, food_name, calories, protein_g, carbs_g, fat_g, serving_size, meal_type, source, logged_at, date_key)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        entry.foodName,
        entry.calories,
        entry.protein,
        entry.carbs,
        entry.fat,
        null,
        entry.mealType,
        'manual',
        now,
        currentKey,
      ]
    );

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    await loadData();
  };

  if (!isProfileComplete) {
    return (
      <SafeAreaView style={styles.container}>
        <ProfileRequiredGate
          onBack={() => {
            triggerHaptic();
            navigation.goBack();
          }}
          onNavigateProfileSetup={() => {
            triggerHaptic();
            navigation.navigate('ProfileSetup');
          }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* iOS Navigation Header */}
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={() => {
            triggerHaptic();
            navigation.goBack();
          }}
          style={styles.navBackBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft color="#0A84FF" size={26} strokeWidth={2.4} />
        </TouchableOpacity>

        <View style={styles.navCenter}>
          <Text style={styles.navTitle}>Nutrition</Text>
          <Text style={styles.navSubtitle}>{formattedDate}</Text>
        </View>

        {entries.length > 0 ? (
          <TouchableOpacity
            onPress={clearTodayEntries}
            accessibilityRole="button"
            accessibilityLabel="Reset today's logged nutrition to 0"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.navActionBtn}
          >
            <RotateCcw color="rgba(255, 255, 255, 0.7)" size={18} strokeWidth={2.2} />
          </TouchableOpacity>
        ) : (
          <View style={styles.navActionPlaceholder} />
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Calorie Activity Ring */}
        <CalorieActivityRing
          totalCalories={totalCalories}
          dailyTarget={dailyTarget}
          caloriesPct={caloriesPct}
        />

        {/* 3 Macronutrient Cards */}
        <MacroCardRow
          totalProtein={totalProtein}
          proteinGoal={macroGoals.proteinGrams}
          proteinPct={proteinPct}
          totalCarbs={totalCarbs}
          carbsGoal={macroGoals.carbsGrams}
          carbsPct={carbsPct}
          totalFat={totalFat}
          fatGoal={macroGoals.fatGrams}
          fatPct={fatPct}
        />

        {/* Quick Actions */}
        <NutritionQuickActions
          onManualEntry={() => {
            triggerHaptic();
            setShowManual(true);
          }}
          onBarcodeScan={() => {
            triggerHaptic();
            setShowBarcodeChoiceModal(true);
          }}
          onAiScan={() => {
            triggerHaptic();
            navigation.navigate('AiFoodScannerScreen');
          }}
        />

        {/* Meals Today Breakdown */}
        <MealsBreakdownCard
          mealBreakdown={mealBreakdown}
          onAddMeal={(meal) => {
            triggerHaptic();
            setManualMealType(meal);
            setShowManual(true);
          }}
        />

        {/* Logged Foods List */}
        <LoggedFoodsList
          entries={entries}
          onDeleteEntry={deleteEntry}
          onClearAll={clearTodayEntries}
        />

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Manual Entry Modal */}
      <ManualEntryModal
        visible={showManual}
        initialMeal={manualMealType}
        onClose={() => setShowManual(false)}
        onSave={saveManualEntry}
      />

      {/* Barcode Choice Modal */}
      <BarcodeChoiceModal
        visible={showBarcodeChoiceModal}
        onClose={() => setShowBarcodeChoiceModal(false)}
        onSelectCamera={() => {
          navigation.navigate('BarcodeScannerScreen', { mode: 'camera' });
        }}
        onSelectUpload={(imageUri) => {
          navigation.navigate('BarcodeScannerScreen', {
            mode: 'upload',
            initialImageUri: imageUri,
          });
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 52,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  navBackBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  navCenter: {
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  navSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 1,
  },
  navActionBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  navActionPlaceholder: {
    width: 44,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
