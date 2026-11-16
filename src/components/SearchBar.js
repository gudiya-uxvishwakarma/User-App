import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { FONTS, FONT_SIZES } from '../constants/typography';
import { SPACING, RADIUS, SHADOW } from '../constants/spacing';

const SearchBar = ({
  value,
  onChangeText,
  placeholder = 'Search apartments, cities, localities...',
  onFocus,
  onSubmit,
  onFilterPress,
  editable = true,
  style,
}) => (
  <View style={[styles.container, style]}>
    <View style={styles.searchBox}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textLight}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        editable={editable}
      />
      {!!value && (
        <TouchableOpacity onPress={() => onChangeText('')}>
          <Text style={styles.clear}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
    {onFilterPress && (
      <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress}>
        <Text style={styles.filterIcon}>⚙</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    ...SHADOW.sm,
  },
  icon: { fontSize: 16, marginRight: SPACING.sm },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    color: COLORS.text,
    fontFamily: FONTS.regular,
    paddingVertical: 0,
  },
  clear: { fontSize: 14, color: COLORS.textLight, padding: SPACING.xs },
  filterBtn: {
    backgroundColor: COLORS.primary,
    width: 46,
    height: 46,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW.sm,
  },
  filterIcon: { fontSize: 18, color: COLORS.white },
});

export default SearchBar;
