import React, { useState } from 'react';
import {
  View, TextInput, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { FONTS, FONT_SIZES } from '../constants/typography';
import { SPACING, RADIUS } from '../constants/spacing';

const CustomInput = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  leftIcon,
  rightIcon,
  onRightIconPress,
  editable = true,
  maxLength,
  style,
  inputStyle,
  autoCapitalize = 'sentences',
  returnKeyType,
  onSubmitEditing,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputWrapper,
        isFocused && styles.focused,
        !!error && styles.errorBorder,
        !editable && styles.disabled,
        multiline && styles.multiline,
      ]}>
        {!!leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => { setIsFocused(false); onBlur?.(); }}
          secureTextEntry={secureTextEntry && !showPass}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />
        {secureTextEntry ? (
          <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.rightIcon}>
            <Text style={styles.toggleText}>{showPass ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        ) : rightIcon ? (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>{rightIcon}</TouchableOpacity>
        ) : null}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.md },
  label: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    minHeight: 50,
  },
  focused: { borderColor: COLORS.primary, backgroundColor: COLORS.white },
  errorBorder: { borderColor: COLORS.error },
  disabled: { opacity: 0.6 },
  multiline: { alignItems: 'flex-start', minHeight: 100 },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.base,
    color: COLORS.text,
    fontFamily: FONTS.regular,
    paddingVertical: SPACING.sm,
  },
  multilineInput: { textAlignVertical: 'top', paddingTop: SPACING.sm },
  leftIcon: { marginRight: SPACING.sm },
  rightIcon: { marginLeft: SPACING.sm },
  toggleText: { fontSize: FONT_SIZES.sm, color: COLORS.primary, fontFamily: FONTS.medium },
  error: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.error,
    marginTop: 4,
    fontFamily: FONTS.regular,
  },
});

export default CustomInput;
