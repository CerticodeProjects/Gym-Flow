import React, { act } from 'react';
import TestRenderer from 'react-test-renderer';
import { ExerciseDetailScreen } from '../../src/screens/ExerciseDetailScreen';
import * as Haptics from 'expo-haptics';

jest.mock('expo-haptics', () => ({
  selectionAsync: jest.fn(),
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
}));

jest.mock('../../src/components/WorkoutIllustration', () => ({
  WorkoutIllustration: () => 'WorkoutIllustration',
}));

const mockWorkout = {
  id: 'workout-bench-press',
  title: 'Bench Press Power',
  slug: 'bench-press',
  category: 'chest',
  equipment: 'Barbell',
  difficulty: 'intermediate',
  sets: 4,
  reps: 10,
  description: 'Barbell bench progression with incline accessory work.',
};

describe('ExerciseDetailScreen', () => {
  const mockNavigation = {
    goBack: jest.fn(),
    navigate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders exercise info correctly', async () => {
    let testRenderer: any;
    await act(async () => {
      testRenderer = TestRenderer.create(
        <ExerciseDetailScreen
          navigation={mockNavigation}
          route={{ params: { workout: mockWorkout } }}
        />
      );
    });

    expect(testRenderer).toBeDefined();
    const textNodes = testRenderer.root.findAllByType('Text' as any);
    const flatTexts = textNodes.map((n: any) =>
      Array.isArray(n.props.children) ? n.props.children.join('') : n.props.children
    );

    expect(flatTexts).toContain('Bench Press Power');
    expect(flatTexts).toContain('CHEST');
    expect(flatTexts).toContain('INTERMEDIATE');
    expect(flatTexts).toContain('4 Sets');
    expect(flatTexts).toContain('10 reps');
  });

  it('handles back button navigation', async () => {
    let testRenderer: any;
    await act(async () => {
      testRenderer = TestRenderer.create(
        <ExerciseDetailScreen
          navigation={mockNavigation}
          route={{ params: { workout: mockWorkout } }}
        />
      );
    });

    const backButton = testRenderer.root.find(
      (node: any) =>
        node.props?.accessibilityRole === 'button' &&
        node.props?.accessibilityLabel === 'Back to workouts'
    );
    expect(backButton).toBeDefined();

    await act(async () => {
      backButton.props.onPress();
    });

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });

  it('renders empty fallback when workout is missing', async () => {
    let testRenderer: any;
    await act(async () => {
      testRenderer = TestRenderer.create(
        <ExerciseDetailScreen
          navigation={mockNavigation}
          route={{ params: {} }}
        />
      );
    });

    const textNodes = testRenderer.root.findAllByType('Text' as any);
    const hasEmptyMsg = textNodes.some(
      (n: any) => n.props.children === 'Exercise information not found.'
    );
    expect(hasEmptyMsg).toBe(true);

    const backButton = testRenderer.root.find(
      (node: any) =>
        node.props?.accessibilityRole === 'button' &&
        node.props?.accessibilityLabel === 'Go back'
    );
    expect(backButton).toBeDefined();

    await act(async () => {
      backButton.props.onPress();
    });

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
