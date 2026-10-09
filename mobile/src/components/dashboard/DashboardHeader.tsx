import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, typography, spacing } from '../../theme';

interface DashboardHeaderProps {
  userName?: string;
  streakCount?: number;
  onNavigateStreak: () => void;
  onNotificationsPress?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = 'Member',
  streakCount = 14,
  onNavigateStreak,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Image
          source={require('../../../assets/gymflow-nobg.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
      </View>

      <View style={styles.headerRight}>
        <TouchableOpacity
          style={styles.streakButton}
          onPress={onNavigateStreak}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Daily Streak"
        >
          <Image
            source={require('../../../assets/gif/Fire Streak Orange.gif')}
            style={styles.streakGif}
            resizeMode="contain"
          />
          <Text style={styles.streakText}>{streakCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerLogo: {
    width: 44,
    height: 44,
  },
  greeting: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  userName: {
    fontFamily: typography.fonts.headingBold,
    fontSize: typography.sizes.xl,
    color: colors.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
    gap: 3,
  },
  streakGif: {
    width: 36,
    height: 36,
  },
  streakText: {
    fontFamily: typography.fonts.headingBold,
    fontSize: 16,
    fontWeight: '800',
    color: '#FF7A00',
  },
});
