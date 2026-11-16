import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, RADIUS } from '../../constants/spacing';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { validateLogin, hasErrors } from '../../utils/validation';
import { authService } from '../../services/authService';
import { useApp } from '../../context/AppContext';

const LoginScreen = ({ navigation }) => {
  const { login } = useApp();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const errs = validateLogin(form);
    setErrors(errs);
    if (hasErrors(errs)) return;

    setLoading(true);
    try {
      const res = await authService.login(form);
      await login(res.token, res.user);
    } catch (e) {
      Alert.alert('Login Failed', e.message || 'Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.logo}>🏡</Text>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue finding your perfect home</Text>
        </View>

        <View style={styles.demoBox}>
          <Text style={styles.demoText}>Demo: demo@homequest.com / demo123</Text>
        </View>

        <CustomInput
          label="Email Address"
          placeholder="Enter your email"
          value={form.email}
          onChangeText={v => setForm(p => ({ ...p, email: v }))}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <CustomInput
          label="Password"
          placeholder="Enter your password"
          value={form.password}
          onChangeText={v => setForm(p => ({ ...p, password: v }))}
          error={errors.password}
          secureTextEntry
        />

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotLink}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <CustomButton title="Login" onPress={handleLogin} loading={loading} />

        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  scroll: { flexGrow: 1, paddingHorizontal: SPACING.base, paddingBottom: SPACING.xxxl },
  header: { alignItems: 'center', marginTop: SPACING.xxl, marginBottom: SPACING.xxl },
  logo: { fontSize: 56, marginBottom: SPACING.md },
  title: { fontSize: FONT_SIZES.display, fontFamily: FONTS.bold, color: COLORS.text, fontWeight: '700' },
  subtitle: { fontSize: FONT_SIZES.base, color: COLORS.textSecondary, fontFamily: FONTS.regular, textAlign: 'center', marginTop: SPACING.sm, lineHeight: 22 },
  demoBox: {
    backgroundColor: '#EEF2FF', borderRadius: RADIUS.md, padding: SPACING.md,
    marginBottom: SPACING.xl, alignItems: 'center',
  },
  demoText: { fontSize: FONT_SIZES.sm, color: COLORS.primary, fontFamily: FONTS.medium },
  forgotLink: { alignSelf: 'flex-end', marginBottom: SPACING.xl, marginTop: -SPACING.xs },
  forgotText: { fontSize: FONT_SIZES.sm, color: COLORS.primary, fontFamily: FONTS.medium },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xl },
  registerText: { fontSize: FONT_SIZES.base, color: COLORS.textSecondary },
  registerLink: { fontSize: FONT_SIZES.base, color: COLORS.primary, fontFamily: FONTS.bold, fontWeight: '700' },
});

export default LoginScreen;
