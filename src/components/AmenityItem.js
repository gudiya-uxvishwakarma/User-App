import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { FONTS, FONT_SIZES } from '../constants/typography';
import { SPACING, RADIUS } from '../constants/spacing';

const AMENITY_ICONS = {
  'Lift': '🛗', 'Parking': '🅿️', 'Power Backup': '⚡', 'Water Supply': '💧',
  'Security': '🔒', 'CCTV': '📹', 'Swimming Pool': '🏊', 'Gym': '🏋️',
  'Garden': '🌿', 'Clubhouse': '🏛️', "Children's Play Area": '🎠',
  'Jogging Track': '🏃', 'Community Hall': '🏠', 'Sports Area': '⚽',
  'Wi-Fi': '📶', 'Intercom': '📞', 'Fire Safety': '🔥',
};

const AmenityItem = ({ name, available = true, style }) => (
  <View style={[styles.item, !available && styles.unavailable, style]}>
    <Text style={styles.icon}>{AMENITY_ICONS[name] || '✓'}</Text>
    <Text style={[styles.text, !available && styles.unavailableText]}>{name}</Text>
  </View>
);

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  unavailable: { opacity: 0.4 },
  icon: { fontSize: 16, marginRight: SPACING.xs },
  text: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    fontWeight: '500',
  },
  unavailableText: { color: COLORS.textLight },
});

export default AmenityItem;
