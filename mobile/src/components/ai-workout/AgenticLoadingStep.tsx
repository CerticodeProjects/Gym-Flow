import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { ThoughtLine } from '../ThoughtLine';
import { DifficultyOption, FrequencyOption } from '../../services/aiWorkoutGenerator';

interface AgenticLoadingStepProps {
  agentStepIndex: number;
  selectedFrequency: FrequencyOption;
  selectedDifficulty: DifficultyOption;
}

export const AgenticLoadingStep: React.FC<AgenticLoadingStepProps> = ({
  agentStepIndex,
  selectedFrequency,
  selectedDifficulty,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={[styles.agenticLoadingFull, { opacity: fadeAnim }]}>
      <View style={styles.agenticCenterContent}>
        <View style={styles.thoughtLineStationaryAnchor}>
          <ThoughtLine
            label="Thinking..."
            doneLabel="Thought for"
            working={agentStepIndex < 5}
            currentStepIndex={agentStepIndex}
            steps={[
              'Analyzing training frequency',
              `Calibrating ${selectedDifficulty} intensity`,
              `Designing ${selectedFrequency}-day workout split`,
              'Selecting exercises & volume',
              'Finalizing personalized protocol',
            ]}
            collapsible={true}
          />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  agenticLoadingFull: {
    flex: 1,
    backgroundColor: '#0A0A0A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  agenticCenterContent: {
    width: '100%',
    alignItems: 'center',
  },
  thoughtLineStationaryAnchor: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
});
