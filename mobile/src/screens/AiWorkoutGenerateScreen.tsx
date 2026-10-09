import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { ChevronLeft, Sparkles } from '../components/icons';
import { colors } from '../theme';
import { useCustomWorkoutsStore, CustomRoutineWorkout } from '../store/customWorkoutsStore';
import {
  FrequencyOption,
  DifficultyOption,
  GeneratedSplitData,
  FREQUENCY_OPTIONS,
  DIFFICULTY_OPTIONS,
  synthesizeAiRoutine,
} from '../services/aiWorkoutGenerator';
import {
  StepTitleGroup,
  AppleSelectionCard,
  AgenticLoadingStep,
  GeneratedSplitView,
} from '../components/ai-workout';

export const AiWorkoutGenerateScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { addCustomWorkout } = useCustomWorkoutsStore();

  // Wizard state: 1 (Frequency), 2 (Difficulty), 3 (Agentic Loading), 4 (Result View)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // User selections
  const [selectedFrequency, setSelectedFrequency] = useState<FrequencyOption>('3-4');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyOption>('intermediate');

  // Generated routine state
  const [generatedSplit, setGeneratedSplit] = useState<GeneratedSplitData | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Loading screen: active agentic reasoning step index (0 to 4)
  const [agentStepIndex, setAgentStepIndex] = useState<number>(0);

  // Screen push transition matching ProfileSetupScreen
  const IOS_PUSH_EASING = useMemo(() => Easing.bezier(0.32, 0.72, 0, 1), []);
  const stepSlideAnim = useRef(new Animated.Value(0)).current;
  const stepOpacityAnim = useRef(new Animated.Value(1)).current;
  const prevStepRef = useRef(currentStep);

  useEffect(() => {
    if (prevStepRef.current === currentStep) return;
    const direction = currentStep > prevStepRef.current ? 1 : -1;
    prevStepRef.current = currentStep;

    if (currentStep <= 2) {
      stepSlideAnim.setValue(direction * 40);
      stepOpacityAnim.setValue(0);

      Animated.parallel([
        Animated.timing(stepSlideAnim, {
          toValue: 0,
          duration: 300,
          easing: IOS_PUSH_EASING,
          useNativeDriver: true,
        }),
        Animated.timing(stepOpacityAnim, {
          toValue: 1,
          duration: 260,
          easing: IOS_PUSH_EASING,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [currentStep, IOS_PUSH_EASING, stepSlideAnim, stepOpacityAnim]);

  // Continuous slim progress bar animation
  const progressAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (currentStep <= 2) {
      Animated.timing(progressAnim, {
        toValue: currentStep / 2,
        duration: 320,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }).start();
    }
  }, [currentStep, progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // Agentic Reasoning Timeline
  useEffect(() => {
    if (currentStep === 3) {
      setAgentStepIndex(0);

      const timers: ReturnType<typeof setTimeout>[] = [];
      timers.push(setTimeout(() => setAgentStepIndex(1), 800));
      timers.push(setTimeout(() => setAgentStepIndex(2), 1600));
      timers.push(setTimeout(() => setAgentStepIndex(3), 2400));
      timers.push(setTimeout(() => setAgentStepIndex(4), 3200));

      timers.push(
        setTimeout(() => {
          const split = synthesizeAiRoutine(selectedFrequency, selectedDifficulty);
          setGeneratedSplit(split);
          setActiveDayIndex(0);
          try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } catch {}
          setCurrentStep(4);
        }, 4000)
      );

      return () => {
        timers.forEach(clearTimeout);
      };
    }
  }, [currentStep, selectedFrequency, selectedDifficulty]);

  const handleSaveAllDays = () => {
    if (!generatedSplit) return;

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}

    generatedSplit.days.forEach((day, index) => {
      const newRoutine: CustomRoutineWorkout = {
        id: `custom-ai-${Date.now()}-${index}`,
        title: day.title,
        slug: `ai-routine-${generatedSplit.difficulty}-day${index + 1}`,
        category: day.category,
        duration_minutes: day.durationMinutes,
        calories: day.calories,
        difficulty: generatedSplit.difficulty,
        equipment: 'Full Gym Setup',
        sets: day.exercises.reduce((sum, e) => sum + e.preferredSets, 0),
        reps: 10,
        sets_reps: `${day.exercises.length} Exercises`,
        image_url: '',
        description: `${generatedSplit.splitName} — ${day.dayLabel}. ${generatedSplit.coachRationale}`,
        completion_percentage: 0,
        is_favorite: false,
        source: 'local',
        primaryMuscle: day.category,
        secondaryMuscles: [],
        exerciseType: 'strength',
        isCustomRoutine: true,
        routineExercises: day.exercises,
      };
      addCustomWorkout(newRoutine);
    });

    navigation.navigate('MainTabs', {
      screen: 'CatalogTab',
    });
  };

  const handleRegenerate = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    setGeneratedSplit(null);
    setActiveDayIndex(0);
    setCurrentStep(3);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header for Setup Steps (1 and 2) */}
      {currentStep <= 2 && (
        <View style={styles.setupHeader}>
          <View style={styles.setupNavBar}>
            <TouchableOpacity
              onPress={() => {
                if (currentStep === 1) {
                  navigation.goBack();
                } else {
                  setCurrentStep(1);
                }
              }}
              style={styles.setupBackButton}
              activeOpacity={0.6}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <ChevronLeft size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
        </View>
      )}

      {/* STEP 1: Frequency */}
      {currentStep === 1 && (
        <View style={styles.screenWrapper}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={[
                styles.stepWrapper,
                {
                  opacity: stepOpacityAnim,
                  transform: [{ translateX: stepSlideAnim }],
                },
              ]}
            >
              <StepTitleGroup
                title="How often do you train?"
                subtitle="Select your intended weekly frequency so GymFlow AI can calibrate volume, muscle splits, and recovery windows."
                stepKey={currentStep}
              />

              <View style={styles.optionsList}>
                {FREQUENCY_OPTIONS.map((item, idx) => (
                  <AppleSelectionCard
                    key={item.id}
                    index={idx}
                    stepKey={currentStep}
                    isSelected={selectedFrequency === item.id}
                    title={item.title}
                    tag={item.tag}
                    subtitle={item.subtitle}
                    icon={item.icon}
                    onPress={() => {
                      try {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      } catch {}
                      setSelectedFrequency(item.id);
                    }}
                  />
                ))}
              </View>
            </Animated.View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => {
                try {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                } catch {}
                setCurrentStep(2);
              }}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Continue to Difficulty"
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 2: Difficulty */}
      {currentStep === 2 && (
        <View style={styles.screenWrapper}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View
              style={[
                styles.stepWrapper,
                {
                  opacity: stepOpacityAnim,
                  transform: [{ translateX: stepSlideAnim }],
                },
              ]}
            >
              <StepTitleGroup
                title="What is your target difficulty?"
                subtitle="Calibrates technical complexity of exercises, mechanical tension, and target rest periods."
                stepKey={currentStep}
              />

              <View style={styles.optionsList}>
                {DIFFICULTY_OPTIONS.map((item, idx) => (
                  <AppleSelectionCard
                    key={item.id}
                    index={idx}
                    stepKey={currentStep}
                    isSelected={selectedDifficulty === item.id}
                    title={item.title}
                    tag={item.tag}
                    subtitle={item.subtitle}
                    icon={item.icon}
                    onPress={() => {
                      try {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      } catch {}
                      setSelectedDifficulty(item.id);
                    }}
                  />
                ))}
              </View>
            </Animated.View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => {
                try {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                } catch {}
                setCurrentStep(3);
              }}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Generate AI Workout"
            >
              <View style={styles.btnRow}>
                <Sparkles size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.primaryButtonText}>Generate AI Workout</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 3: Loading */}
      {currentStep === 3 && (
        <AgenticLoadingStep
          agentStepIndex={agentStepIndex}
          selectedFrequency={selectedFrequency}
          selectedDifficulty={selectedDifficulty}
        />
      )}

      {/* STEP 4: Generated Split View */}
      {currentStep === 4 && generatedSplit && (
        <GeneratedSplitView
          split={generatedSplit}
          activeDayIndex={activeDayIndex}
          onSelectDay={setActiveDayIndex}
          onBack={() => setCurrentStep(2)}
          onRegenerate={handleRegenerate}
          onSaveAllDays={handleSaveAllDays}
          onExercisePress={(ex) => {
            try {
              Haptics.selectionAsync();
            } catch {}
            navigation.navigate('WorkoutDetail', {
              workoutId: ex.id,
              exercise: ex,
            });
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenWrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  setupHeader: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 8,
    backgroundColor: '#0A0A0A',
  },
  setupNavBar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  setupBackButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: -4,
  },
  progressTrack: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 1.5,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 1.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  stepWrapper: {
    flex: 1,
  },
  optionsList: {
    gap: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: '#0A0A0A',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
