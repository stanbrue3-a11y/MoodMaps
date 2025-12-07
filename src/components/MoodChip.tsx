import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, touchTarget } from '../constants/theme';

interface MoodChipProps {
  label: string;
  color: string;
  active: boolean;
  onPress: () => void;
}

export default function MoodChip({ label, color, active, onPress }: MoodChipProps) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        { borderColor: color, minHeight: touchTarget.minSize },
        active && { backgroundColor: color },
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: colors.black,
  },
  activeLabel: {
    color: colors.white,
  },
});
