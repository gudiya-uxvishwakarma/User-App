import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { FONTS, FONT_SIZES } from '../constants/typography';
import { SPACING } from '../constants/spacing';
import CustomButton from './CustomButton';

const EmptyState = ({
  icon = '🏠',
  title = 'Nothing here yet',
  message,
  actionLabel,
  onAction,
  style,
}) => (
  <View style={[styles.container, style]}>
    <Text style={styles.icon}>{icon}</Text>
    <Text style={styles.title}>{title}</Text>
    {!!message && <Text style={styles.message}>{message}</Text>}
    {!!actionLabel && onAction && (
      <CustomButton
        title={actionLabel}
        onPress={onAction}
        fullWidth={false}
        style={styles.btn}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  icon: { fontSize: 56, marginBottom: SPACING.md },
  title: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    fontWeight: '700',
    textAlign: 'center',
  },
  message: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 22,
  },
  btn: { marginTop: SPACING.xl },
});

export default EmptyState;
