import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Dumbbell, Flame, Watch } from '../icons';

interface ProfileCompletionModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({
  visible,
  onClose,
}) => {
  const handleContinue = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.appleModalCard}>
          {/* Apple "What's New" Header */}
          <Text style={styles.appleModalTitle}>What’s New in GymFlow</Text>

          {/* Apple Feature Rows with Signature Gold Icons */}
          <View style={styles.appleFeatureList}>
            {/* Feature 1: Workouts */}
            <View style={styles.appleFeatureItem}>
              <View style={styles.appleFeatureIconCol}>
                <Dumbbell size={28} color="#FFCC00" strokeWidth={2.0} />
              </View>
              <View style={styles.appleFeatureTextCol}>
                <Text style={styles.appleFeatureItemTitle}>Personalized Workout Plan</Text>
                <Text style={styles.appleFeatureItemDesc}>
                  Custom routines, progressive splits, and exercise guide tailored to your biometrics.
                </Text>
              </View>
            </View>

            {/* Feature 2: Nutrition */}
            <View style={styles.appleFeatureItem}>
              <View style={styles.appleFeatureIconCol}>
                <Flame size={28} color="#FFCC00" strokeWidth={2.0} />
              </View>
              <View style={styles.appleFeatureTextCol}>
                <Text style={styles.appleFeatureItemTitle}>Caloric & Nutrition Targets</Text>
                <Text style={styles.appleFeatureItemDesc}>
                  Daily caloric allowance, macro distributions, and water goals calculated and ready.
                </Text>
              </View>
            </View>

            {/* Feature 3: Biometrics / Watch */}
            <View style={styles.appleFeatureItem}>
              <View style={styles.appleFeatureIconCol}>
                <Watch size={28} color="#FFCC00" strokeWidth={2.0} />
              </View>
              <View style={styles.appleFeatureTextCol}>
                <Text style={styles.appleFeatureItemTitle}>Biometrics Configured</Text>
                <Text style={styles.appleFeatureItemDesc}>
                  Biometrics saved to monitor recovery, training strain, and metabolic output.
                </Text>
              </View>
            </View>
          </View>

          {/* Apple Signature Yellow Pill Button */}
          <View style={styles.appleModalBtnRow}>
            <TouchableOpacity
              style={styles.appleContinueBtn}
              onPress={handleContinue}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Continue"
            >
              <Text style={styles.appleContinueBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
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
  appleModalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#2C2C2E',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    borderRadius: 28,
    paddingTop: 30,
    paddingBottom: 24,
    paddingHorizontal: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.55,
    shadowRadius: 36,
    elevation: 20,
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        } as any)
      : {}),
  },
  appleModalTitle: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'left',
    letterSpacing: -0.4,
    marginBottom: 26,
  },
  appleFeatureList: {
    width: '100%',
    gap: 22,
    marginBottom: 32,
  },
  appleFeatureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  appleFeatureIconCol: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2,
    marginRight: 10,
  },
  appleFeatureTextCol: {
    flex: 1,
  },
  appleFeatureItemTitle: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  appleFeatureItemDesc: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 13,
    color: 'rgba(235, 235, 245, 0.60)',
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  appleModalBtnRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  appleContinueBtn: {
    backgroundColor: '#FFCC00',
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  appleContinueBtnText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.2,
  },
});
