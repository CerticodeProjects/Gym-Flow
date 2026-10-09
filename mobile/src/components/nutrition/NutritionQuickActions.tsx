import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SquarePen, ScanBarcode, Sparkles } from '../icons';

interface NutritionQuickActionsProps {
  onManualEntry: () => void;
  onBarcodeScan: () => void;
  onAiScan: () => void;
}

export const NutritionQuickActions: React.FC<NutritionQuickActionsProps> = ({
  onManualEntry,
  onBarcodeScan,
  onAiScan,
}) => {
  return (
    <View>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionHeaderTitle}>QUICK ACTIONS</Text>
      </View>
      <View style={styles.quickActionsRow}>
        <TouchableOpacity
          style={styles.quickActionBtn}
          onPress={onManualEntry}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Manual Entry"
        >
          <SquarePen color="#8E8E93" size={22} strokeWidth={2} style={{ marginBottom: 6 }} />
          <Text style={styles.quickActionTitle}>Manual</Text>
          <Text style={styles.quickActionSubtitle}>Type item</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionBtn}
          onPress={onBarcodeScan}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Barcode Scanner"
        >
          <ScanBarcode color="#8E8E93" size={22} strokeWidth={2} style={{ marginBottom: 6 }} />
          <Text style={styles.quickActionTitle}>Barcode</Text>
          <Text style={styles.quickActionSubtitle}>Scan pack</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionBtn}
          onPress={onAiScan}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="AI Scanner"
        >
          <Sparkles color="#8E8E93" size={22} strokeWidth={2} style={{ marginBottom: 6 }} />
          <Text style={styles.quickActionTitle}>AI Scanner</Text>
          <Text style={styles.quickActionSubtitle}>Snap meal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  quickActionBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  quickActionSubtitle: {
    fontSize: 10.5,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.45)',
    marginTop: 2,
  },
});
