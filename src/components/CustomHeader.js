import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { FONTS, FONT_SIZES } from '../constants/typography';
import { SPACING } from '../constants/spacing';

const CustomHeader = ({
  title,
  subtitle,
  onBack,
  rightComponent,
  transparent = false,
  light = false, // light text for dark backgrounds
  style,
}) => {
  const insets = useSafeAreaInsets();
  const textColor = light ? COLORS.white : COLORS.text;
  const bgColor = transparent ? 'transparent' : COLORS.white;

  return (
    <View style={[
      styles.container,
      { paddingTop: insets.top + SPACING.sm, backgroundColor: bgColor },
      !transparent && styles.shadow,
      style,
    ]}>
      <StatusBar
        barStyle={light ? 'light-content' : 'dark-content'}
        backgroundColor={transparent ? 'transparent' : COLORS.white}
        translucent={transparent}
      />
      <View style={styles.row}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={[styles.backArrow, { color: textColor }]}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} />
        )}

        <View style={styles.center}>
          {!!title && (
            <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>{title}</Text>
          )}
          {!!subtitle && (
            <Text style={[styles.subtitle, { color: light ? 'rgba(255,255,255,0.75)' : COLORS.textSecondary }]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        <View style={styles.right}>
          {rightComponent || <View style={styles.placeholder} />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING.sm,
    paddingHorizontal: SPACING.base,
    zIndex: 10,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 22,
    fontFamily: FONTS.bold,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.bold,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.regular,
    marginTop: 1,
  },
  right: {
    width: 40,
    alignItems: 'flex-end',
  },
  placeholder: { width: 40 },
});

export default CustomHeader;
