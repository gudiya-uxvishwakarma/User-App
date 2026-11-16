import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, RADIUS } from '../../constants/spacing';
import CustomButton from '../../components/CustomButton';
import CustomHeader from '../../components/CustomHeader';
import { authService } from '../../services/authService';
import { useApp } from '../../context/AppContext';

const OTPScreen = ({ navigation, route }) => {
  const { phone } = route.params || {};
  const { login } = useApp();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const inputs = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setResendTimer(t => t > 0 ? t - 1 : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInput = (val, idx) => {
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 3) inputs.current[idx + 1]?.focus();
    if (!val && idx > 0) inputs.current[idx - 1]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 4) return Alert.alert('Error', 'Please enter the 4-digit OTP');
    setLoading(true);
    try {
      const res = await authService.verifyOtp({ phone, otp: code });
      await login(res.token, res.user);
    } catch (e) {
      Alert.alert('Invalid OTP', e.message || 'The OTP you entered is incorrect.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setResendTimer(30);
    setOtp(['', '', '', '']);
    inputs.current[0]?.focus();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <CustomHeader title="OTP Verification" onBack={() => navigation.goBack()} />
      <View style={styles.container}>
        <Text style={styles.icon}>📱</Text>
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          We've sent a 4-digit code to{'\n'}
          <Text style={styles.phone}>{phone || 'your number'}</Text>
        </Text>
        <Text style={styles.hint}>Use any 4-digit code for demo</Text>

        <View style={styles.otpRow}>
          {otp.map((val, idx) => (
            <TextInput
              key={idx}
              ref={r => (inputs.current[idx] = r)}
              style={[styles.otpBox, val && styles.otpBoxFilled]}
              value={val}
              onChangeText={v => handleInput(v.slice(-1), idx)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        <CustomButton title="Verify OTP" onPress={handleVerify} loading={loading} />

        <View style={styles.resendRow}>
          {resendTimer > 0 ? (
            <Text style={styles.timerText}>Resend OTP in {resendTimer}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendLink}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1, paddingHorizontal: SPACING.base, paddingTop: SPACING.xxl, alignItems: 'center' },
  icon: { fontSize: 64, marginBottom: SPACING.md },
  title: { fontSize: FONT_SIZES.xxl, fontFamily: FONTS.bold, color: COLORS.text, fontWeight: '700', textAlign: 'center' },
  subtitle: { fontSize: FONT_SIZES.base, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.sm, lineHeight: 22 },
  phone: { color: COLORS.primary, fontFamily: FONTS.bold, fontWeight: '700' },
  hint: { fontSize: FONT_SIZES.sm, color: COLORS.secondary, fontFamily: FONTS.medium, marginTop: SPACING.sm, backgroundColor: '#FFFBEB', paddingHorizontal: SPACING.md, paddingVertical: 4, borderRadius: RADIUS.sm },
  otpRow: { flexDirection: 'row', gap: SPACING.md, marginVertical: SPACING.xxl },
  otpBox: {
    width: 60, height: 60, borderRadius: RADIUS.lg, borderWidth: 2, borderColor: COLORS.border,
    fontSize: FONT_SIZES.xxl, fontFamily: FONTS.bold, color: COLORS.text,
    backgroundColor: COLORS.inputBg, textAlign: 'center', fontWeight: '700',
  },
  otpBoxFilled: { borderColor: COLORS.primary, backgroundColor: '#EEF2FF' },
  resendRow: { marginTop: SPACING.xl, alignItems: 'center' },
  timerText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  resendLink: { fontSize: FONT_SIZES.base, color: COLORS.primary, fontFamily: FONTS.bold, fontWeight: '700' },
});

export default OTPScreen;
