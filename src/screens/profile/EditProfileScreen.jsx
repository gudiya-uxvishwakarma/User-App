import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING } from '../../constants/spacing';
import CustomHeader from '../../components/CustomHeader';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { authService } from '../../services/authService';
import { useApp } from '../../context/AppContext';

const EditProfileScreen = ({ navigation }) => {
  const { user, login, token } = useApp();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', city: user?.city || '' });
  const [loading, setLoading] = useState(false);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    if (!form.name.trim()) return Alert.alert('Error', 'Name is required');
    setLoading(true);
    try {
      const res = await authService.updateProfile(form);
      await login(token, res.user);
      Alert.alert('Success', 'Profile updated successfully', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <CustomHeader title="Edit Profile" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <CustomInput label="Full Name" value={form.name} onChangeText={v => update('name', v)} />
        <CustomInput label="Email" value={form.email} onChangeText={v => update('email', v)} keyboardType="email-address" autoCapitalize="none" />
        <CustomInput label="Phone" value={form.phone} onChangeText={v => update('phone', v)} keyboardType="phone-pad" />
        <CustomInput label="City" value={form.city} onChangeText={v => update('city', v)} />
        <CustomButton title="Save Changes" onPress={handleSave} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  scroll: { padding: SPACING.base },
});

export default EditProfileScreen;
