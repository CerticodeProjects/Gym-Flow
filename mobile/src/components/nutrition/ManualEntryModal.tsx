import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { X } from '../icons';
import { MEAL_TYPES, MealType } from './MealsBreakdownCard';

interface ManualEntryModalProps {
  visible: boolean;
  initialMeal?: MealType;
  onClose: () => void;
  onSave: (entry: {
    foodName: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    mealType: MealType;
  }) => Promise<void>;
}

export const ManualEntryModal: React.FC<ManualEntryModalProps> = ({
  visible,
  initialMeal = 'Snacks',
  onClose,
  onSave,
}) => {
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [meal, setMeal] = useState<MealType>(initialMeal);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (visible) {
      setMeal(initialMeal);
    }
  }, [visible, initialMeal]);

  const triggerHaptic = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  };

  const handleSave = async () => {
    if (!foodName.trim()) {
      Alert.alert('Required', 'Please enter a food name.');
      return;
    }
    const cal = parseInt(calories, 10) || 0;
    setIsSaving(true);
    try {
      await onSave({
        foodName: foodName.trim(),
        calories: cal,
        protein: parseFloat(protein) || 0,
        carbs: parseFloat(carbs) || 0,
        fat: parseFloat(fat) || 0,
        mealType: meal,
      });
      setFoodName('');
      setCalories('');
      setProtein('');
      setCarbs('');
      setFat('');
      onClose();
    } catch (err) {
      Alert.alert('Error', 'Could not save entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <Pressable
          style={styles.backdropDismiss}
          onPress={() => {
            triggerHaptic();
            onClose();
          }}
        />

        <View style={styles.sheet}>
          <View style={styles.sheetDragHandle} />

          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>Log Food</Text>
              <Text style={styles.sheetSubtitle}>Enter meal and macronutrient details</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                triggerHaptic();
                onClose();
              }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.sheetCloseBtn}
              accessibilityRole="button"
              accessibilityLabel="Close manual entry"
            >
              <X color="rgba(255, 255, 255, 0.7)" size={16} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            <Text style={styles.inputLabel}>FOOD NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Grilled Chicken & Rice"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              value={foodName}
              onChangeText={setFoodName}
            />

            <Text style={styles.inputLabel}>CALORIES (KCAL)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 450"
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              keyboardType="numeric"
              value={calories}
              onChangeText={setCalories}
            />

            <Text style={styles.inputLabel}>MACRONUTRIENTS (OPTIONAL)</Text>
            <View style={styles.macroInputRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.miniLabel}>Protein (g)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  keyboardType="decimal-pad"
                  value={protein}
                  onChangeText={setProtein}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.miniLabel}>Carbs (g)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  keyboardType="decimal-pad"
                  value={carbs}
                  onChangeText={setCarbs}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.miniLabel}>Fat (g)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  keyboardType="decimal-pad"
                  value={fat}
                  onChangeText={setFat}
                />
              </View>
            </View>

            <Text style={styles.inputLabel}>MEAL CATEGORY</Text>
            <View style={styles.mealSegmentControl}>
              {MEAL_TYPES.map((m) => {
                const isActive = meal === m;
                return (
                  <TouchableOpacity
                    key={m}
                    style={[styles.mealSegmentPill, isActive && styles.mealSegmentPillActive]}
                    onPress={() => {
                      triggerHaptic();
                      setMeal(m);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.mealSegmentText, isActive && styles.mealSegmentTextActive]}>
                      {m}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              disabled={isSaving}
              activeOpacity={0.85}
            >
              {isSaving ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={styles.saveBtnText}>Add to Log</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  backdropDismiss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    backgroundColor: '#1C1C1E',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    maxHeight: '85%',
  },
  sheetDragHandle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  sheetSubtitle: {
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
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 6,
    marginTop: 12,
  },
  miniLabel: {
    fontSize: 10.5,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.45)',
    marginBottom: 4,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#FFFFFF',
  },
  macroInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  mealSegmentControl: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    padding: 3,
    marginTop: 4,
    marginBottom: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  mealSegmentPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealSegmentPillActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  mealSegmentText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.55)',
  },
  mealSegmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: '#30D158',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.2,
  },
});
