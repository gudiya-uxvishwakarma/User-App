import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING } from '../../constants/spacing';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import CustomHeader from '../../components/CustomHeader';
import { validateRegister, hasErrors } from '../../utils/validation';
import { authService } from '../../services/authService';

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleRegister = async () => {
    const errs = validateRegister(form);
    setErrors(errs);
    if (hasErrors(errs)) return;

    setLoading(true);
    try {
      const res = await authService.register(form);
      navigation.navigate('OTP', { phone: form.phone, fromRegister: true });
    } catch (e) {
      Alert.alert('Registration Failed', e.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <CustomHeader title="Create Account" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Fill in your details to get started</Text>
        <CustomInput label="Full Name" placeholder="Your full name" value={form.name} onChangeText={v => update('name', v)} error={errors.name} />
        <CustomInput label="Email Address" placeholder="Your email" value={form.email} onChangeText={v => update('email', v)} error={errors.email} keyboardType="email-address" autoCapitalize="none" />
        <CustomInput label="Phone Number" placeholder="10-digit mobile number" value={form.phone} onChangeText={v => update('phone', v)} error={errors.phone} keyboardType="phone-pad" />
        <CustomInput label="Password" placeholder="Create a password" value={form.password} onChangeText={v => update('password', v)} error={errors.password} secureTextEntry />
        <CustomInput label="Confirm Password" placeholder="Repeat your password" value={form.confirmPassword} onChangeText={v => update('confirmPassword', v)} error={errors.confirmPassword} secureTextEntry />
        <CustomButton title="Create Account" onPress={handleRegister} loading={loading} />
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  scroll: { flexGrow: 1, paddingHorizontal: SPACING.base, paddingBottom: SPACING.xxxl },
  subtitle: { fontSize: FONT_SIZES.base, color: COLORS.textSecondary, marginTop: SPACING.md, marginBottom: SPACING.xl },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xl },
  loginText: { fontSize: FONT_SIZES.base, color: COLORS.textSecondary },
  loginLink: { fontSize: FONT_SIZES.base, color: COLORS.primary, fontFamily: FONTS.bold, fontWeight: '700' },
});

export default RegisterScreen;
