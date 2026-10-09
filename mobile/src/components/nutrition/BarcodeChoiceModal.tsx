import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image, ChevronRight, X } from '../icons';

interface BarcodeChoiceModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCamera: () => void;
  onSelectUpload: (imageUri: string) => void;
}

export const BarcodeChoiceModal: React.FC<BarcodeChoiceModalProps> = ({
  visible,
  onClose,
  onSelectCamera,
  onSelectUpload,
}) => {
  const triggerHaptic = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  };

  const handlePickImage = async () => {
    triggerHaptic();
    onClose();
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });
      if (result.canceled || !result.assets[0]?.uri) {
        return;
      }
      onSelectUpload(result.assets[0].uri);
    } catch (err) {
      console.warn('[BarcodeChoiceModal] Image picker error:', err);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.choiceModalBackdrop}
        activeOpacity={1}
        onPress={() => {
          triggerHaptic();
          onClose();
        }}
      >
        <TouchableOpacity
          style={styles.choiceModalContent}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.sheetDragHandle} />
          <View style={styles.choiceModalHeader}>
            <View>
              <Text style={styles.choiceModalTitle}>Barcode Scanner</Text>
              <Text style={styles.choiceModalSubtitle}>
                Choose how you want to scan your item
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                triggerHaptic();
                onClose();
              }}
              style={styles.sheetCloseBtn}
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <X color="rgba(255, 255, 255, 0.7)" size={16} />
            </TouchableOpacity>
          </View>

          <View style={styles.choiceCardsContainer}>
            {/* Option 1: Live Camera */}
            <TouchableOpacity
              style={styles.choiceCard}
              onPress={() => {
                triggerHaptic();
                onClose();
                onSelectCamera();
              }}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="Camera"
            >
              <View style={[styles.choiceIconBox, { backgroundColor: 'rgba(48, 209, 88, 0.12)' }]}>
                <Camera color="#30D158" size={22} strokeWidth={2.2} />
              </View>
              <View style={styles.choiceTextContainer}>
                <Text style={styles.choiceCardTitle}>Camera Scanner</Text>
                <Text style={styles.choiceCardDesc}>
                  Scan food barcode in real-time with device camera
                </Text>
              </View>
              <ChevronRight color="rgba(255, 255, 255, 0.3)" size={18} strokeWidth={2} />
            </TouchableOpacity>

            {/* Option 2: Upload Image */}
            <TouchableOpacity
              style={styles.choiceCard}
              onPress={handlePickImage}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="Upload Images"
            >
              <View style={[styles.choiceIconBox, { backgroundColor: 'rgba(10, 132, 255, 0.12)' }]}>
                <Image color="#0A84FF" size={22} strokeWidth={2.2} />
              </View>
              <View style={styles.choiceTextContainer}>
                <Text style={styles.choiceCardTitle}>Choose from Photos</Text>
                <Text style={styles.choiceCardDesc}>
                  Select a photo or package screenshot from library
                </Text>
              </View>
              <ChevronRight color="rgba(255, 255, 255, 0.3)" size={18} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.choiceCancelBtn}
            onPress={() => {
              triggerHaptic();
              onClose();
            }}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Text style={styles.choiceCancelText}>Cancel</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  choiceModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  choiceModalContent: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  sheetDragHandle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  choiceModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  choiceModalTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  choiceModalSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
  sheetCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceCardsContainer: {
    gap: 10,
    marginBottom: 16,
  },
  choiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 18,
    padding: 14,
  },
  choiceIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  choiceTextContainer: {
    flex: 1,
  },
  choiceCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  choiceCardDesc: {
    fontSize: 11.5,
    color: 'rgba(255, 255, 255, 0.45)',
    lineHeight: 16,
  },
  choiceCancelBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
