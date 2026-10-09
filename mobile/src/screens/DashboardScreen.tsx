import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing } from '../theme';
import { DashboardSkeleton } from '../components/SkeletonLoader';
import { ErrorCard } from '../components/ErrorCard';
import { getDatabase } from '../db/connection';
import { useAuthStore } from '../store/authStore';
import { useCustomWorkoutsStore } from '../store/customWorkoutsStore';
import { calculateDailyCalorieTarget } from '../utils/nutritionCalculator';
import { BmiMetricSection } from '../components/BmiMetricSection';
import { DarkVeil } from '../components/DarkVeil';
import {
  DashboardHeader,
  ProfileSetupBanner,
  DailyNutritionHero,
  FeaturesGrid,
  ProfileCompletionModal,
  ProfileRequiredModal,
  GeneratedWorkoutModal,
} from '../components/dashboard';

interface DashboardScreenProps {
  navigation: any;
  route?: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation, route }) => {
  const user = useAuthStore((state) => state.user);
  const isProfileComplete = Boolean(user?.is_profile_completed);
  const { pendingGeneratedWorkout, setPendingGeneratedWorkout } = useCustomWorkoutsStore();

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showProfileRequiredModal, setShowProfileRequiredModal] = useState(false);
  const [blockedFeatureName, setBlockedFeatureName] = useState<string>('Nutrition Tracker');

  useEffect(() => {
    if (route?.params?.profileSetupJustCompleted) {
      setShowCompletionModal(true);
      if (navigation.setParams) {
        navigation.setParams({ profileSetupJustCompleted: undefined });
      }
    }
  }, [route?.params?.profileSetupJustCompleted, navigation]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nutritionConsumed, setNutritionConsumed] = useState<number>(0);
  const [nutritionTarget, setNutritionTarget] = useState<number>(2000);

  // Smooth entrance animation for fully loaded dashboard sections
  const hasLoadedOnce = useRef(false);
  const contentFadeAnim = useRef(new Animated.Value(0)).current;
  const contentSlideAnim = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    if (!isLoading) {
      contentFadeAnim.setValue(0);
      contentSlideAnim.setValue(18);
      Animated.parallel([
        Animated.timing(contentFadeAnim, {
          toValue: 1,
          duration: 480,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(contentSlideAnim, {
          toValue: 0,
          duration: 480,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]).start();
    }
  }, [isLoading, contentFadeAnim, contentSlideAnim]);

  const loadDashboardData = useCallback(async () => {
    setError(null);
    try {
      const db = await getDatabase();
      const d = new Date();
      const todayKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const res = await db.getFirstAsync<{ total: number | null }>(
        `SELECT SUM(calories) as total FROM NutritionEntry WHERE date_key = ?`,
        [todayKey]
      );
      const prefRow = await db.getFirstAsync<{ daily_nutrition_target_calories: number | null; fitness_goal?: string | null }>(
        `SELECT daily_nutrition_target_calories, fitness_goal FROM Preferences WHERE id = ?`,
        ['default']
      );

      let activeTarget = prefRow?.daily_nutrition_target_calories;

      if (!activeTarget && user?.weight_kg && user?.height_cm) {
        const calculated = calculateDailyCalorieTarget({
          weightKg: user.weight_kg,
          heightCm: user.height_cm,
          gender: user.gender || 'male',
          birthdate: user.birthdate,
          fitnessGoal: user.fitness_goal || prefRow?.fitness_goal || 'build_muscle',
        });
        activeTarget = calculated.targetCalories;
        try {
          await db.runAsync(
            `UPDATE Preferences SET daily_nutrition_target_calories = ? WHERE id = 'default'`,
            [activeTarget]
          );
        } catch {}
      }

      if (activeTarget) {
        setNutritionTarget(activeTarget);
      }
      setNutritionConsumed(res?.total ?? 0);

      if (!hasLoadedOnce.current) {
        await new Promise((resolve) => setTimeout(resolve, 450));
        hasLoadedOnce.current = true;
      }
    } catch {
      setError('Unable to refresh dashboard data. Showing cached information.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [loadDashboardData])
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadDashboardData();
  };

  const handleOpenNutrition = () => {
    if (!isProfileComplete) {
      setBlockedFeatureName('Nutrition Tracker');
      setShowProfileRequiredModal(true);
      return;
    }
    navigation.navigate('NutritionScreen');
  };

  const nutritionPercentage = nutritionTarget > 0
    ? Math.min(100, Math.round((nutritionConsumed / nutritionTarget) * 100))
    : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <DarkVeil speed={0.35} warpAmount={0.25} noiseIntensity={0.01} whiteMode={true} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <DashboardHeader
          userName={user?.name || 'Member'}
          streakCount={14}
          onNavigateStreak={() => navigation.navigate('StreakScreen')}
        />

        {error ? <ErrorCard message={error} onRetry={() => loadDashboardData()} /> : null}

        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <Animated.View
            style={[
              styles.loadedContentContainer,
              {
                opacity: contentFadeAnim,
                transform: [{ translateY: contentSlideAnim }],
              },
            ]}
          >
            {!isProfileComplete && (
              <ProfileSetupBanner
                onPressSetup={() => navigation.navigate('ProfileSetup')}
              />
            )}

            <DailyNutritionHero
              nutritionConsumed={nutritionConsumed}
              nutritionTarget={nutritionTarget}
              nutritionPercentage={nutritionPercentage}
              onViewDetails={handleOpenNutrition}
            />

            <BmiMetricSection />

            <FeaturesGrid
              isProfileComplete={isProfileComplete}
              onNavigateWorkout={() => navigation.navigate('CatalogTab')}
              onNavigateMyPlan={() => navigation.navigate('ScheduleScreen')}
              onNavigateProgress={() => navigation.navigate('ProgressTab')}
              onNavigateWater={() => navigation.navigate('WaterIntakeScreen')}
              onNavigateNutrition={() => navigation.navigate('NutritionScreen')}
              onNavigateAiCoach={() => navigation.navigate('AiCoachScreen')}
              onProfileRequired={(name) => {
                setBlockedFeatureName(name);
                setShowProfileRequiredModal(true);
              }}
            />
          </Animated.View>
        )}
      </ScrollView>

      <ProfileCompletionModal
        visible={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
      />

      <ProfileRequiredModal
        visible={showProfileRequiredModal}
        featureName={blockedFeatureName}
        onClose={() => setShowProfileRequiredModal(false)}
        onNavigateProfileSetup={() => navigation.navigate('ProfileSetup')}
      />

      <GeneratedWorkoutModal
        workout={pendingGeneratedWorkout}
        onViewWorkouts={() => {
          setPendingGeneratedWorkout(null);
          navigation.navigate('CatalogTab');
        }}
        onStartWorkout={(routineId) => {
          setPendingGeneratedWorkout(null);
          navigation.navigate('CustomWorkoutDetailScreen', { routineId });
        }}
        onDismiss={() => setPendingGeneratedWorkout(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  loadedContentContainer: {
    width: '100%',
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: 100,
  },
});
