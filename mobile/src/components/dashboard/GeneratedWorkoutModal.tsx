import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Sparkles, Dumbbell, Clock, Flame, ChevronRight } from '../icons';

interface GeneratedWorkoutModalProps {
  workout: any | null;
  onViewWorkouts: () => void;
  onStartWorkout: (routineId: string) => void;
  onDismiss: () => void;
}

export const GeneratedWorkoutModal: React.FC<GeneratedWorkoutModalProps> = ({
  workout,
  onViewWorkouts,
  onStartWorkout,
  onDismiss,
}) => {
  if (!workout) return null;

  const handleViewWorkouts = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    onViewWorkouts();
  };

  const handleStartWorkout = () => {
    if (!workout?.id) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    onStartWorkout(workout.id);
  };

  const handleDismiss = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    onDismiss();
  };

  return (
    <Modal
      visible={Boolean(workout)}
      transparent={true}
      animationType="fade"
      onRequestClose={handleDismiss}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.generatedWorkoutModalCard}>
          {/* Header Badge */}
          <View style={styles.generatedModalHeaderBadge}>
            <Sparkles size={13} color="#007AFF" strokeWidth={2.2} />
            <Text style={styles.generatedModalHeaderBadgeText}>PERSONALIZED WORKOUT GENERATED</Text>
          </View>

          {/* Icon */}
          <View style={styles.generatedWorkoutIconWrapper}>
            <Dumbbell size={26} color="#007AFF" strokeWidth={2.2} />
          </View>

          <Text style={styles.generatedModalTitle}>
            {workout?.title || 'Your Personalized Routine'}
          </Text>
          <Text style={styles.generatedModalSubtitle}>
            {workout?.description || 'Your custom routine has been synthesized and saved to your workouts library.'}
          </Text>

          {/* Quick Metrics Row */}
          <View style={styles.generatedMetricsRow}>
            <View style={styles.generatedMetricBadge}>
              <Clock size={12} color="#007AFF" style={{ marginRight: 5 }} />
              <Text style={styles.generatedMetricBadgeText}>{workout?.duration_minutes || 50} min</Text>
            </View>
            <View style={styles.generatedMetricBadge}>
              <Flame size={12} color="#FF9F0A" style={{ marginRight: 5 }} />
              <Text style={styles.generatedMetricBadgeText}>~{workout?.calories || 440} kcal</Text>
            </View>
            <View style={styles.generatedMetricBadge}>
              <Dumbbell size={12} color="#30D158" style={{ marginRight: 5 }} />
              <Text style={styles.generatedMetricBadgeText}>
                {workout?.routineExercises?.length || 5} Exercises
              </Text>
            </View>
          </View>

          {/* Preview of Exercises */}
          <View style={styles.generatedExercisesList}>
            <Text style={styles.generatedExercisesHeading}>ROUTINE PREVIEW</Text>
            {workout?.routineExercises?.slice(0, 3).map((ex: any, index: number) => (
              <View key={ex.id || index} style={styles.generatedExerciseRow}>
                <View style={styles.generatedExerciseNumberBadge}>
                  <Text style={styles.generatedExerciseNumberText}>{index + 1}</Text>
                </View>
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <Text style={styles.generatedExerciseName} numberOfLines={1}>{ex.title}</Text>
                  <Text style={styles.generatedExerciseMeta}>{ex.preferredSets} sets • {ex.preferredReps}</Text>
                </View>
                <View style={styles.generatedMusclePill}>
                  <Text style={styles.generatedMusclePillText}>{ex.category}</Text>
                </View>
              </View>
            ))}
            {(workout?.routineExercises?.length || 0) > 3 && (
              <Text style={styles.generatedMoreExercisesText}>
                +{(workout?.routineExercises?.length || 0) - 3} more exercises in full routine
              </Text>
            )}
          </View>

          {/* View My Workouts Button */}
          <TouchableOpacity
            style={styles.generatedProceedBtn}
            onPress={handleViewWorkouts}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="View my workouts"
          >
            <Text style={styles.generatedProceedBtnText}>View My Workouts</Text>
            <ChevronRight size={18} color="#FFFFFF" strokeWidth={2.4} style={{ marginLeft: 4 }} />
          </TouchableOpacity>

          {/* Direct Start Routine Option */}
          {workout?.id && (
            <TouchableOpacity
              style={styles.generatedStartDirectBtn}
              onPress={handleStartWorkout}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Start workout routine directly"
            >
              <Text style={styles.generatedStartDirectBtnText}>Start This Workout Now</Text>
            </TouchableOpacity>
          )}

          {/* Dismiss Button */}
          <TouchableOpacity
            style={styles.generatedDismissBtn}
            onPress={handleDismiss}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Explore dashboard first"
          >
            <Text style={styles.generatedDismissBtnText}>Explore Dashboard First</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        } as any)
      : {}),
  },
  generatedWorkoutModalCard: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: 'rgba(28, 28, 30, 0.96)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 28,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
        } as any)
      : {}),
  },
  generatedModalHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.14)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 122, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
    marginBottom: 16,
  },
  generatedModalHeaderBadgeText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 10.5,
    fontWeight: '700',
    color: '#007AFF',
    letterSpacing: 0.6,
  },
  generatedWorkoutIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 122, 255, 0.12)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0, 122, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  generatedModalTitle: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  generatedModalSubtitle: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 13.5,
    color: 'rgba(255, 255, 255, 0.55)',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  generatedMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
    width: '100%',
  },
  generatedMetricBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  generatedMetricBadgeText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  generatedExercisesList: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
    gap: 10,
  },
  generatedExercisesHeading: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.45)',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  generatedExerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  generatedExerciseNumberBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  generatedExerciseNumberText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  generatedExerciseName: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  generatedExerciseMeta: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 1,
  },
  generatedMusclePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  generatedMusclePillText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  generatedMoreExercisesText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    marginTop: 2,
  },
  generatedProceedBtn: {
    width: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 14,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  generatedProceedBtnText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  generatedStartDirectBtn: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  generatedStartDirectBtnText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  generatedDismissBtn: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  generatedDismissBtnText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.5)',
  },
});
