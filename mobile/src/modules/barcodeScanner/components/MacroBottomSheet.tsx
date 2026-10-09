/**
 * Macro Breakdown Bottom Sheet Component
 * Modern dark-first modal sheet displaying nutritional breakdown,
 * serving-size switcher, calorie distribution bar, and meal logging actions.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {
  X,
  Plus,
  RotateCcw,
  ScanBarcode,
  Flame,
  Dumbbell,
  Wheat,
  Droplet,
  Edit2,
  Check,
  AlertCircle,
} from '../../../components/icons';
import { colors, typography, borderRadius } from '../../../theme';
import { ProductMacroInfo, MealType, MacroNutrientValues } from '../types';

export interface MacroBottomSheetProps {
  product: ProductMacroInfo;
  onLogMeal: (item: {
    product: ProductMacroInfo;
    mealType: MealType;
    macros: MacroNutrientValues;
    basis: 'serving' | '100g';
  }) => Promise<void> | void;
  onScanAnother?: () => void;
  onClose: () => void;
  isLogging?: boolean;
}

const MEALS: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

export const MacroBottomSheet: React.FC<MacroBottomSheetProps> = ({
  product,
  onLogMeal,
  onClose,
  isLogging = false,
}) => {
  const [basis, setBasis] = useState<'serving' | '100g'>(
    product.basisAvailable === '100g' ? '100g' : 'serving'
  );
  const [selectedMeal, setSelectedMeal] = useState<MealType>('Snacks');

  const [servingMacros, setServingMacros] = useState<MacroNutrientValues>({ ...product.perServing });
  const [per100gMacros, setPer100gMacros] = useState<MacroNutrientValues>({ ...product.per100g });
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    setServingMacros({ ...product.perServing });
    setPer100gMacros({ ...product.per100g });
    setBasis(product.basisAvailable === '100g' ? '100g' : 'serving');
    const isZero =
      product.perServing.calories === 0 &&
      product.perServing.protein_g === 0 &&
      product.perServing.carbs_g === 0 &&
      product.perServing.fat_g === 0;
    if (isZero) {
      setIsEditing(true);
    }
  }, [product]);

  const activeMacros = basis === 'serving' ? servingMacros : per100gMacros;

  const updateMacro = (field: keyof MacroNutrientValues, rawText: string) => {
    const val = parseFloat(rawText.replace(/,/g, '.')) || 0;
    const updater = (prev: MacroNutrientValues) => ({
      ...prev,
      [field]: val,
    });
    if (basis === 'serving') {
      setServingMacros(updater);
    } else {
      setPer100gMacros(updater);
    }
  };

  const isZeroNutrition =
    activeMacros.calories === 0 &&
    activeMacros.protein_g === 0 &&
    activeMacros.carbs_g === 0 &&
    activeMacros.fat_g === 0;

  // Caloric distribution percentages (accurate calculation)
  const proteinKcal = (activeMacros.protein_g || 0) * 4;
  const carbsKcal = (activeMacros.carbs_g || 0) * 4;
  const fatKcal = (activeMacros.fat_g || 0) * 9;
  const totalMacroKcal = proteinKcal + carbsKcal + fatKcal;

  const proteinPct = totalMacroKcal > 0 ? Math.round((proteinKcal / totalMacroKcal) * 100) : 0;
  const carbsPct = totalMacroKcal > 0 ? Math.round((carbsKcal / totalMacroKcal) * 100) : 0;
  const fatPct = totalMacroKcal > 0 ? Math.max(0, 100 - proteinPct - carbsPct) : 0;

  const handleLogPress = () => {
    onLogMeal({
      product,
      mealType: selectedMeal,
      macros: activeMacros,
      basis,
    });
  };

  return (
    <View style={styles.sheetOverlay}>
      <View style={styles.sheetContainer}>
        {/* Handle Bar */}
        <View style={styles.handleBar} />

        {/* Header Row */}
        <View style={styles.header}>
          <View style={styles.brandContainer}>
            <Text style={styles.brandText}>{product.brand || 'Food Product'}</Text>
            <View style={styles.barcodePill}>
              <ScanBarcode color={colors.textMuted} size={12} style={{ marginRight: 4 }} />
              <Text style={styles.barcodeText}>{product.barcode}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} accessibilityLabel="Close">
            <X color={colors.textSecondary} size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Product Info & Thumbnail */}
          <View style={styles.productRow}>
            {product.imageUrl ? (
              <Image
                source={{ uri: product.imageUrl }}
                style={styles.productImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <ScanBarcode color={colors.textMuted} size={32} />
              </View>
            )}

            <View style={styles.productDetails}>
              <Text style={styles.productTitle} numberOfLines={2}>
                {product.productName}
              </Text>
              <Text style={styles.servingInfo}>
                Serving Size: <Text style={styles.servingValue}>{product.servingSize}</Text>
              </Text>
            </View>
          </View>

          {/* Missing Macro Warning Banner if database has 0 nutrition */}
          {isZeroNutrition && (
            <View style={styles.missingWarningCard}>
              <AlertCircle color={colors.warningAmber} size={18} style={{ marginRight: 8, marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.missingWarningTitle}>Nutrition Data Not In Database</Text>
                <Text style={styles.missingWarningText}>
                  Open Food Facts did not have macro facts for this barcode. Enter the macros below from the packaging before logging.
                </Text>
              </View>
            </View>
          )}

          {/* Basis Switcher: Per Serving vs Per 100g */}
          <View style={styles.basisSwitchWrapper}>
            <TouchableOpacity
              style={[styles.basisTab, basis === 'serving' && styles.basisTabActive]}
              onPress={() => setBasis('serving')}
            >
              <Text style={[styles.basisTabText, basis === 'serving' && styles.basisTabTextActive]}>
                Per Serving ({product.servingSize})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.basisTab, basis === '100g' && styles.basisTabActive]}
              onPress={() => setBasis('100g')}
            >
              <Text style={[styles.basisTabText, basis === '100g' && styles.basisTabTextActive]}>
                Per 100g
              </Text>
            </TouchableOpacity>
          </View>

          {/* Nutrition Header with Edit Toggle */}
          <View style={styles.macroHeaderRow}>
            <Text style={styles.sectionLabel}>Nutritional Breakdown</Text>
            <TouchableOpacity
              style={styles.editMacrosBtn}
              onPress={() => setIsEditing(!isEditing)}
              activeOpacity={0.7}
            >
              {isEditing ? (
                <>
                  <Check color={colors.primary} size={14} style={{ marginRight: 4 }} />
                  <Text style={styles.editMacrosBtnTextActive}>Done Editing</Text>
                </>
              ) : (
                <>
                  <Edit2 color={colors.textSecondary} size={14} style={{ marginRight: 4 }} />
                  <Text style={styles.editMacrosBtnText}>Edit Values</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* 4 Primary Macro Cards */}
          <View style={styles.macroGrid}>
            {/* Calories */}
            <View style={[styles.macroCard, styles.macroCardHighlight]}>
              <View style={styles.macroIconRow}>
                <Flame color={colors.yellow} size={16} />
                <Text style={styles.macroCardLabel}>CALORIES</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={styles.macroInput}
                  keyboardType="numeric"
                  value={activeMacros.calories ? String(activeMacros.calories) : ''}
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  onChangeText={(txt) => updateMacro('calories', txt)}
                />
              ) : (
                <Text style={styles.macroValueCalories}>{activeMacros.calories}</Text>
              )}
              <Text style={styles.macroUnit}>kcal</Text>
            </View>

            {/* Protein */}
            <View style={styles.macroCard}>
              <View style={styles.macroIconRow}>
                <Dumbbell color={colors.cyan} size={16} />
                <Text style={styles.macroCardLabel}>PROTEIN</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={[styles.macroInput, { color: colors.cyan }]}
                  keyboardType="numeric"
                  value={activeMacros.protein_g ? String(activeMacros.protein_g) : ''}
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  onChangeText={(txt) => updateMacro('protein_g', txt)}
                />
              ) : (
                <Text style={[styles.macroValue, { color: colors.cyan }]}>
                  {activeMacros.protein_g}
                </Text>
              )}
              <Text style={styles.macroUnit}>grams</Text>
            </View>

            {/* Carbs */}
            <View style={styles.macroCard}>
              <View style={styles.macroIconRow}>
                <Wheat color={colors.warningAmber} size={16} />
                <Text style={styles.macroCardLabel}>CARBS</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={[styles.macroInput, { color: colors.warningAmber }]}
                  keyboardType="numeric"
                  value={activeMacros.carbs_g ? String(activeMacros.carbs_g) : ''}
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  onChangeText={(txt) => updateMacro('carbs_g', txt)}
                />
              ) : (
                <Text style={[styles.macroValue, { color: colors.warningAmber }]}>
                  {activeMacros.carbs_g}
                </Text>
              )}
              <Text style={styles.macroUnit}>grams</Text>
            </View>

            {/* Fats */}
            <View style={styles.macroCard}>
              <View style={styles.macroIconRow}>
                <Droplet color="#FF6B8B" size={16} />
                <Text style={styles.macroCardLabel}>FATS</Text>
              </View>
              {isEditing ? (
                <TextInput
                  style={[styles.macroInput, { color: '#FF6B8B' }]}
                  keyboardType="numeric"
                  value={activeMacros.fat_g ? String(activeMacros.fat_g) : ''}
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  onChangeText={(txt) => updateMacro('fat_g', txt)}
                />
              ) : (
                <Text style={[styles.macroValue, { color: '#FF6B8B' }]}>{activeMacros.fat_g}</Text>
              )}
              <Text style={styles.macroUnit}>grams</Text>
            </View>
          </View>

          {/* Caloric Distribution Ratio Bar */}
          <View style={styles.ratioContainer}>
            <View style={styles.ratioHeader}>
              <Text style={styles.ratioTitle}>Macro Ratio</Text>
              <Text style={styles.ratioSubtitle}>Calorie split</Text>
            </View>

            <View style={styles.ratioBar}>
              {totalMacroKcal > 0 ? (
                <>
                  <View style={[styles.ratioSegment, { flex: Math.max(proteinPct, 2), backgroundColor: colors.cyan }]} />
                  <View style={[styles.ratioSegment, { flex: Math.max(carbsPct, 2), backgroundColor: colors.warningAmber }]} />
                  <View style={[styles.ratioSegment, { flex: Math.max(fatPct, 2), backgroundColor: '#FF6B8B' }]} />
                </>
              ) : (
                <View style={[styles.ratioSegment, { flex: 1, backgroundColor: colors.surfaceHighlight }]} />
              )}
            </View>

            <View style={styles.ratioLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.cyan }]} />
                <Text style={styles.legendText}>Protein {proteinPct}%</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.warningAmber }]} />
                <Text style={styles.legendText}>Carbs {carbsPct}%</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF6B8B' }]} />
                <Text style={styles.legendText}>Fat {fatPct}%</Text>
              </View>
            </View>
          </View>

          {/* Secondary Nutrients (Fiber & Sodium) */}
          {(activeMacros.fiber_g !== undefined || activeMacros.sodium_mg !== undefined) && (
            <View style={styles.secondaryNutrientsRow}>
              {activeMacros.fiber_g !== undefined && (
                <View style={styles.secondaryNutrientBadge}>
                  <Text style={styles.secondaryLabel}>Fiber:</Text>
                  <Text style={styles.secondaryValue}>{activeMacros.fiber_g}g</Text>
                </View>
              )}
              {activeMacros.sodium_mg !== undefined && (
                <View style={styles.secondaryNutrientBadge}>
                  <Text style={styles.secondaryLabel}>Sodium:</Text>
                  <Text style={styles.secondaryValue}>{activeMacros.sodium_mg}mg</Text>
                </View>
              )}
            </View>
          )}

          {/* Meal Selection Selector */}
          <Text style={styles.sectionLabel}>Select Meal</Text>
          <View style={styles.mealPillRow}>
            {MEALS.map((meal) => {
              const isSelected = selectedMeal === meal;
              return (
                <TouchableOpacity
                  key={meal}
                  style={[styles.mealPill, isSelected && styles.mealPillActive]}
                  onPress={() => setSelectedMeal(meal)}
                >
                  <Text style={[styles.mealPillText, isSelected && styles.mealPillTextActive]}>
                    {meal}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Action Button */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.logButton}
              onPress={handleLogPress}
              disabled={isLogging}
              activeOpacity={0.8}
            >
              {isLogging ? (
                <ActivityIndicator color={colors.textInverse} size="small" />
              ) : (
                <>
                  <Plus color={colors.textInverse} size={18} style={{ marginRight: 6 }} />
                  <Text style={styles.logButtonText}>Log {selectedMeal}</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sheetOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
    zIndex: 20,
  },
  sheetContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    borderTopWidth: 1,
    borderColor: colors.borderHighlight,
    maxHeight: '88%',
    paddingBottom: 28,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderHighlight,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  brandContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.headingBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  barcodePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceHighlight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  barcodeText: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: typography.fonts.body,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  imagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDetails: {
    flex: 1,
    marginLeft: 14,
  },
  productTitle: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.headingBold,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 4,
  },
  servingInfo: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  servingValue: {
    color: colors.text,
    fontFamily: typography.fonts.headingBold,
  },
  basisSwitchWrapper: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    padding: 3,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  basisTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  basisTabActive: {
    backgroundColor: colors.surfaceHighlight,
  },
  basisTabText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    fontFamily: typography.fonts.headingMedium,
  },
  basisTabTextActive: {
    color: colors.text,
    fontFamily: typography.fonts.headingBold,
  },
  macroGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  macroCard: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    alignItems: 'center',
  },
  macroCardHighlight: {
    backgroundColor: 'rgba(255, 214, 0, 0.08)',
    borderColor: 'rgba(255, 214, 0, 0.25)',
  },
  macroIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  macroCardLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  macroValueCalories: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.headingBlack,
    color: colors.text,
  },
  macroValue: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.fonts.headingBlack,
  },
  macroUnit: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ratioContainer: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  ratioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ratioTitle: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.headingBold,
    color: colors.text,
  },
  ratioSubtitle: {
    fontSize: 10,
    color: colors.textMuted,
  },
  ratioBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  ratioSegment: {
    height: '100%',
  },
  ratioLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  secondaryNutrientsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  secondaryNutrientBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  secondaryLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginRight: 4,
  },
  secondaryValue: {
    fontSize: 11,
    color: colors.text,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.headingBold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  mealPillRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  mealPill: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  mealPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  mealPillText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.headingMedium,
    color: colors.text,
  },
  mealPillTextActive: {
    color: colors.textInverse,
    fontFamily: typography.fonts.headingBold,
  },
  actionsRow: {
    gap: 10,
  },
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: borderRadius.lg,
  },
  logButtonText: {
    fontSize: typography.sizes.base,
    fontFamily: typography.fonts.headingBold,
    color: colors.textInverse,
  },
  scanAnotherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceHighlight,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    borderRadius: borderRadius.lg,
  },
  scanAnotherButtonText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.headingMedium,
    color: colors.text,
  },
  missingWarningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 179, 0, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 179, 0, 0.3)',
    borderRadius: borderRadius.md,
    padding: 12,
    marginBottom: 16,
  },
  missingWarningTitle: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.headingBold,
    color: colors.warningAmber,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  missingWarningText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.body,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  macroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  editMacrosBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editMacrosBtnText: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.headingMedium,
    color: colors.textSecondary,
  },
  editMacrosBtnTextActive: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fonts.headingBold,
    color: colors.primary,
  },
  macroInput: {
    fontSize: 20,
    fontFamily: typography.fonts.headingBold,
    color: colors.text,
    textAlign: 'center',
    paddingVertical: 2,
    paddingHorizontal: 4,
    minWidth: 48,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: colors.borderHighlight,
    marginVertical: 4,
  },
});
