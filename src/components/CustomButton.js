import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { FONTS, FONT_SIZES } from '../constants/typography';
import { SPACING, RADIUS } from '../constants/spacing';

const CustomButton = ({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'md',         // 'sm' | 'md' | 'lg'
  loading = false,
  disabled = false,
  fullWidth = true,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}) => {
  const sizeStyles = {
    sm: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, borderRadius: RADIUS.md },
    md: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl, borderRadius: RADIUS.lg },
    lg: { paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xxl, borderRadius: RADIUS.xl },
  };

  const variantStyles = {
    primary: { backgroundColor: COLORS.primary },
    secondary: { backgroundColor: COLORS.secondary },
    outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: COLORS.primary },
    ghost: { backgroundColor: 'transparent' },
    danger: { backgroundColor: COLORS.error },
    success: { backgroundColor: COLORS.success },
  };

  const textColors = {
    primary: COLORS.white,
    secondary: COLORS.primary,
    outline: COLORS.primary,
    ghost: COLORS.primary,
    danger: COLORS.white,
    success: COLORS.white,
  };

  const fontSizes = { sm: FONT_SIZES.sm, md: FONT_SIZES.base, lg: FONT_SIZES.lg };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColors[variant]} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={[
            styles.text,
            { color: textColors[variant], fontSize: fontSizes[size] },
            textStyle,
          ]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.55 },
  text: {
    fontFamily: FONTS.bold,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: { marginRight: SPACING.sm },
  iconRight: { marginLeft: SPACING.sm },
});

export default CustomButton;
