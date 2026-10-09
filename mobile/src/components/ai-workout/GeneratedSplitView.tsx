import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  ChevronLeft,
  RotateCcw,
  Sparkles,
  Calendar,
  Zap,
  Dumbbell,
  ChevronRight,
} from '../icons';
import { colors } from '../../theme';
import { WorkoutIllustration } from '../WorkoutIllustration';
import { GeneratedSplitData } from '../../services/aiWorkoutGenerator';

const APPLE_FONT_FAMILY =
  Platform.OS === 'web'
    ? '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif'
    : Platform.OS === 'ios'
    ? 'System'
    : 'Roboto';

interface GeneratedSplitViewProps {
  split: GeneratedSplitData;
  activeDayIndex: number;
  onSelectDay: (index: number) => void;
  onBack: () => void;
  onRegenerate: () => void;
  onSaveAllDays: () => void;
  onExercisePress: (exercise: any) => void;
}

export const GeneratedSplitView: React.FC<GeneratedSplitViewProps> = ({
  split,
  activeDayIndex,
  onSelectDay,
  onBack,
  onRegenerate,
  onSaveAllDays,
  onExercisePress,
}) => {
  const activeDay = split.days[activeDayIndex];

  return (
    <View style={styles.screenWrapper}>
      {/* Top iOS Navigation Bar */}
      <View style={styles.step4NavBar}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.step4NavButton}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Back to setup"
        >
          <ChevronLeft size={22} color="#007AFF" strokeWidth={2.4} />
        </TouchableOpacity>

        <Text style={styles.step4NavTitle}>AI Generated Split</Text>

        <TouchableOpacity
          onPress={onRegenerate}
          style={styles.step4NavButton}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Regenerate routine"
        >
          <RotateCcw size={20} color="#007AFF" strokeWidth={2.2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.resultScrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Split Overview Card (Apple Fitness Material) */}
        <View style={styles.routineHeroCard}>
          <View style={styles.heroAiBadgeRow}>
            <View style={styles.heroAiBadge}>
              <Sparkles size={12} color="#007AFF" />
              <Text style={styles.heroAiBadgeText}>AI GENERATED SPLIT</Text>
            </View>
            <View style={styles.frequencyTag}>
              <Text style={styles.frequencyTagText}>
                {split.frequency === '7' ? '7' : split.frequency} DAYS/WK
              </Text>
            </View>
          </View>

          <Text style={styles.routineHeroTitle}>{split.splitName}</Text>

          {/* Summary metrics strip */}
          <View style={styles.heroMetricsStrip}>
            <View style={styles.heroMetricItem}>
              <Calendar size={13} color="rgba(255, 255, 255, 0.7)" />
              <Text style={styles.heroMetricValue}>
                {split.days.length} Days
              </Text>
            </View>
            <View style={styles.heroMetricDivider} />
            <View style={styles.heroMetricItem}>
              <Zap size={13} color="rgba(255, 255, 255, 0.7)" />
              <Text style={styles.heroMetricValue}>
                {split.difficulty.toUpperCase()}
              </Text>
            </View>
            <View style={styles.heroMetricDivider} />
            <View style={styles.heroMetricItem}>
              <Dumbbell size={13} color="rgba(255, 255, 255, 0.7)" />
              <Text style={styles.heroMetricValue}>
                {split.days.reduce((sum, d) => sum + d.exercises.length, 0)} Total
              </Text>
            </View>
          </View>
        </View>

        {/* Apple Inset Segmented Control for Days */}
        <View style={styles.segmentedTrack}>
          {split.days.map((day, idx) => {
            const isActive = activeDayIndex === idx;
            return (
              <TouchableOpacity
                key={idx}
                style={[styles.segmentTab, isActive && styles.segmentTabActive]}
                onPress={() => {
                  try {
                    Haptics.selectionAsync();
                  } catch {}
                  onSelectDay(idx);
                }}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentTabText,
                    isActive && styles.segmentTabTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {day.dayLabel}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Active Day Detail */}
        {activeDay && (
          <View style={styles.dayDetailWrap}>
            <View style={styles.dayDetailHeader}>
              <Text style={styles.dayDetailTitle}>{activeDay.title}</Text>
              <Text style={styles.dayDetailSubtitle}>
                {activeDay.exercises.length} Exercises
              </Text>
            </View>

            <View style={styles.exercisesListStack}>
              {activeDay.exercises.map((ex, index) => (
                <TouchableOpacity
                  key={ex.id || `ex-${index}`}
                  style={styles.exerciseItemCard}
                  onPress={() => onExercisePress(ex)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`${ex.title}, ${ex.category}`}
                >
                  {/* Step Index Badge */}
                  <View style={styles.exerciseStepBadge}>
                    <Text style={styles.exerciseStepText}>{index + 1}</Text>
                  </View>

                  {/* Static Illustration Squircle */}
                  <View style={styles.exerciseIllustrationWrap}>
                    <WorkoutIllustration
                      slug={ex.slug}
                      size={50}
                      autoPlay={false}
                      interactive={false}
                      backgroundColor="#FFFFFF"
                    />
                  </View>

                  {/* Exercise Details Column */}
                  <View style={styles.exerciseDetails}>
                    <Text style={styles.exerciseTitleText} numberOfLines={1}>
                      {ex.title}
                    </Text>
                    <Text style={styles.exerciseCategorySubtext}>
                      {ex.category?.toUpperCase() || 'STRENGTH'}
                    </Text>
                  </View>

                  {/* Disclosure Chevron */}
                  <ChevronRight
                    size={14}
                    color="rgba(255, 255, 255, 0.3)"
                    strokeWidth={2.5}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Apple Bottom Dock: Only Save All Days Primary Button */}
      <View style={styles.appleBottomDock}>
        <TouchableOpacity
          style={styles.applePrimarySaveBtn}
          onPress={onSaveAllDays}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Save all days to my workouts"
        >
          <Text style={styles.applePrimarySaveBtnText}>
            Save All {split.days.length} Days to My Workouts
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  step4NavBar: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: '#0A0A0A',
  },
  step4NavButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  step4NavTitle: {
    fontFamily: APPLE_FONT_FAMILY,
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  resultScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  routineHeroCard: {
    backgroundColor: 'rgba(28, 28, 30, 0.8)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 18,
    marginBottom: 20,
  },
  heroAiBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  heroAiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 122, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  heroAiBadgeText: {
    fontFamily: APPLE_FONT_FAMILY,
    fontSize: 10,
    fontWeight: '700',
    color: '#007AFF',
    letterSpacing: 0.5,
  },
  frequencyTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  frequencyTagText: {
    fontFamily: APPLE_FONT_FAMILY,
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  routineHeroTitle: {
    fontFamily: APPLE_FONT_FAMILY,
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 14,
    letterSpacing: -0.5,
  },
  heroMetricsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  heroMetricItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  heroMetricValue: {
    fontFamily: APPLE_FONT_FAMILY,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  heroMetricDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  segmentedTrack: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    padding: 3,
    marginBottom: 18,
    gap: 4,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  segmentTabActive: {
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  segmentTabText: {
    fontFamily: APPLE_FONT_FAMILY,
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  segmentTabTextActive: {
    color: '#FFFFFF',
  },
  dayDetailWrap: {
    gap: 12,
  },
  dayDetailHeader: {
    marginBottom: 4,
  },
  dayDetailTitle: {
    fontFamily: APPLE_FONT_FAMILY,
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  dayDetailSubtitle: {
    fontFamily: APPLE_FONT_FAMILY,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
  exercisesListStack: {
    gap: 10,
  },
  exerciseItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(28, 28, 30, 0.7)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
    gap: 12,
  },
  exerciseStepBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseStepText: {
    fontFamily: APPLE_FONT_FAMILY,
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  exerciseIllustrationWrap: {
    width: 50,
    height: 50,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseTitleText: {
    fontFamily: APPLE_FONT_FAMILY,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  exerciseCategorySubtext: {
    fontFamily: APPLE_FONT_FAMILY,
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.45)',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  appleBottomDock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: 'rgba(10, 10, 10, 0.92)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  applePrimarySaveBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  applePrimarySaveBtnText: {
    fontFamily: APPLE_FONT_FAMILY,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
});
