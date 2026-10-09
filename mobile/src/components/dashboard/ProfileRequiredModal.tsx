import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

interface ProfileRequiredModalProps {
  visible: boolean;
  featureName?: string;
  onClose: () => void;
  onNavigateProfileSetup: () => void;
}

export const ProfileRequiredModal: React.FC<ProfileRequiredModalProps> = ({
  visible,
  onClose,
  onNavigateProfileSetup,
}) => {
  const handleProceed = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    onClose();
    onNavigateProfileSetup();
  };

  const handleCancel = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Profile Setup Required</Text>
          <Text style={styles.modalSubtitle}>
            You must complete your profile setup in order to use this feature.
          </Text>

          <Text style={styles.modalFeatureDesc}>
            Personalize your biometrics (gender, birthdate, weight, and height) to calculate accurate targets and tracking data.
          </Text>

          <TouchableOpacity
            style={styles.modalDismissBtn}
            onPress={handleProceed}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Complete Profile Setup"
          >
            <Text style={styles.modalDismissBtnText}>Complete Profile Setup</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalCancelBtn}
            onPress={handleCancel}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Maybe Later"
          >
            <Text style={styles.modalCancelBtnText}>Maybe Later</Text>
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
  modalCard: {
    width: '100%',
    maxWidth: 420,
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
  modalTitle: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  modalSubtitle: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 14,
    color: '#9E9E9E',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  modalFeatureDesc: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  modalDismissBtn: {
    width: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalDismissBtnText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalCancelBtn: {
    width: '100%',
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelBtnText: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 14,
    fontWeight: '600',
    color: '#9E9E9E',
  },
});
