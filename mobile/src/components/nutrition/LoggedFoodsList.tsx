import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Trash2 } from '../icons';

export interface NutritionEntryItem {
  id: string;
  food_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  serving_size: string | null;
  meal_type: string;
  source: string;
  logged_at: string;
  image_url?: string | null;
  barcode?: string | null;
}

interface LoggedFoodsListProps {
  entries: NutritionEntryItem[];
  onDeleteEntry: (id: string) => void;
  onClearAll: () => void;
}

const sourceIcon = (source: string) => {
  if (source === 'barcode') return '📷';
  if (source === 'ai_scan') return '✨';
  return '✏️';
};

const FoodThumbnail: React.FC<{ imageUrl?: string | null; source: string }> = ({ imageUrl, source }) => {
  const [hasError, setHasError] = useState(false);

  if (imageUrl && !hasError) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={styles.entryProductImage}
        resizeMode="cover"
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <View style={styles.entrySourceBadge}>
      <Text style={styles.entrySourceEmoji}>{sourceIcon(source)}</Text>
    </View>
  );
};

export const LoggedFoodsList: React.FC<LoggedFoodsListProps> = ({
  entries,
  onDeleteEntry,
  onClearAll,
}) => {
  if (entries.length === 0) return null;

  return (
    <View style={styles.loggedSection}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeaderTitle}>TODAY'S LOG ({entries.length})</Text>
        <TouchableOpacity
          onPress={onClearAll}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.clearAllBtnText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.insetGroupedCard}>
        {entries.map((entry, index) => {
          const isLast = index === entries.length - 1;
          return (
            <View key={entry.id}>
              <View style={styles.entryRow}>
                <View style={styles.entryLeading}>
                  <FoodThumbnail imageUrl={entry.image_url} source={entry.source} />
                  <View style={styles.entryTextContainer}>
                    <View style={styles.entryTitleRow}>
                      <Text style={styles.entryFoodName} numberOfLines={1}>
                        {entry.food_name}
                      </Text>
                      <View style={styles.entryMealTag}>
                        <Text style={styles.entryMealTagText}>{entry.meal_type}</Text>
                      </View>
                    </View>
                    <Text style={styles.entryMacroLine}>
                      {entry.calories} kcal · P {entry.protein_g?.toFixed(0) ?? 0}g · C {entry.carbs_g?.toFixed(0) ?? 0}g · F {entry.fat_g?.toFixed(0) ?? 0}g
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => onDeleteEntry(entry.id)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.entryDeleteBtn}
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${entry.food_name}`}
                >
                  <Trash2 size={16} color="rgba(255, 255, 255, 0.35)" />
                </TouchableOpacity>
              </View>
              {!isLast && <View style={styles.rowDivider} />}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loggedSection: {
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 6,
    paddingHorizontal: 4,
  },
  sectionHeaderTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  clearAllBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#FF453A',
  },
  insetGroupedCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
    marginBottom: 22,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  entryLeading: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  entrySourceBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  entryProductImage: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  entrySourceEmoji: {
    fontSize: 15,
  },
  entryTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  entryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  entryFoodName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  entryMealTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  entryMealTagText: {
    fontSize: 10.5,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.55)',
  },
  entryMacroLine: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  entryDeleteBtn: {
    padding: 6,
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginLeft: 46,
  },
});
