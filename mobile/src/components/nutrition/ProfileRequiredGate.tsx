import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft, Lock } from '../icons';

interface ProfileRequiredGateProps {
  onBack: () => void;
  onNavigateProfileSetup: () => void;
}

export const ProfileRequiredGate: React.FC<ProfileRequiredGateProps> = ({
  onBack,
  onNavigateProfileSetup,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={onBack}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.navBackBtn}
        >
          <ChevronLeft color="#0A84FF" size={26} strokeWidth={2.4} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Nutrition</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.gateContainer}>
        <View style={styles.gateCard}>
          <View style={styles.gateIconWrapper}>
            <Lock size={32} color="#FF9F0A" />
          </View>
          <Text style={styles.gateTitle}>Profile Setup Required</Text>
          <Text style={styles.gateMessage}>
            Complete your profile to unlock Apple-caliber nutrition tracking, personalized caloric goals, and daily macro targets.
          </Text>

          <TouchableOpacity
            style={styles.gatePrimaryBtn}
            onPress={onNavigateProfileSetup}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Complete Profile Setup"
          >
            <Text style={styles.gatePrimaryBtnText}>Complete Profile Setup</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gateSecondaryBtn}
            onPress={onBack}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Go Back"
          >
            <Text style={styles.gateSecondaryBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
  navTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  gateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  gateCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: 28,
    alignItems: 'center',
  },
  gateIconWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255, 159, 10, 0.14)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 159, 10, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  gateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginBottom: 8,
    textAlign: 'center',
  },
  gateMessage: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.55)',
    textAlign: 'center',
    marginBottom: 24,
  },
  gatePrimaryBtn: {
    backgroundColor: '#FF9F0A',
    paddingVertical: 14,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  gatePrimaryBtnText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
  },
  gateSecondaryBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  gateSecondaryBtnText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 14,
    fontWeight: '600',
  },
});
