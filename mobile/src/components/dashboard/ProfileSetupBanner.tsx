import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { ChevronRight } from '../icons';
import { borderRadius, spacing } from '../../theme';

interface ProfileSetupBannerProps {
  onPressSetup: () => void;
}

export const ProfileSetupBanner: React.FC<ProfileSetupBannerProps> = ({ onPressSetup }) => {
  return (
    <View style={styles.profileSetupCard}>
      <View style={styles.profileSetupTop}>
        <Text style={styles.profileSetupStepsCount}>4 quick steps</Text>
      </View>

      <Text style={styles.profileSetupTitle}>Finish Your Profile Setup</Text>
      <Text style={styles.profileSetupSubtitle}>
        Set your gender, birthdate, weight, and height to calibrate your workouts & caloric burn targets.
      </Text>

      <TouchableOpacity
        style={styles.profileSetupButton}
        onPress={onPressSetup}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Finish Your Profile Setup"
      >
        <Text style={styles.profileSetupButtonText}>Set Up Profile</Text>
        <ChevronRight size={16} color="#000000" strokeWidth={2.5} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profileSetupCard: {
    backgroundColor: '#111111',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: spacing.lg,
  },
  profileSetupTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  profileSetupStepsCount: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 12,
    color: '#888888',
  },
  profileSetupTitle: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  profileSetupSubtitle: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 13,
    color: '#A0A0A0',
    lineHeight: 18,
    marginBottom: 16,
  },
  profileSetupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 6,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  profileSetupButtonText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
});
