import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, RADIUS } from '../../constants/spacing';
import CustomHeader from '../../components/CustomHeader';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { validateBooking, hasErrors } from '../../utils/validation';
import { bookingService } from '../../services/bookingService';
import { useApp } from '../../context/AppContext';
import { TIME_SLOTS } from '../../constants/index';

const BookingScreen = ({ navigation, route }) => {
  const { apartment } = route.params || {};
  const { user } = useApp();

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    visitDate: '',
    timeSlot: '',
    visitors: '1',
    message: '',
    tower: '',
    flat: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (key, val) => setForm(p => ({ ...p, [key]: val }));

  // Generate next 14 days
  const getDateOptions = () => {
    const dates = [];
    for (let i = 1; i <= 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const label = d.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' });
      const value = d.toISOString().split('T')[0];
      dates.push({ label, value });
    }
    return dates;
  };

  const handleSubmit = async () => {
    const errs = validateBooking({
      name: form.name,
      phone: form.phone,
      visitDate: form.visitDate,
      timeSlot: form.timeSlot,
      visitors: parseInt(form.visitors),
    });
    setErrors(errs);
    if (hasErrors(errs)) return;

    setLoading(true);
    try {
      const res = await bookingService.create({
        apartmentId: apartment.id,
        apartmentName: apartment.name,
        apartmentImage: apartment.coverImage,
        tower: form.tower || null,
        flat: form.flat || null,
        visitDate: form.visitDate,
        timeSlot: form.timeSlot,
        visitors: parseInt(form.visitors),
        userName: form.name,
        userPhone: form.phone,
        message: form.message,
      });
      navigation.replace('BookingConfirm', { booking: res.data });
    } catch (e) {
      Alert.alert('Booking Failed', e.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const dateOptions = getDateOptions();

  return (
    <SafeAreaView style={styles.safe}>
      <CustomHeader title="Book a Visit" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Apartment Info */}
        <View style={styles.aptInfo}>
          <Text style={styles.aptName}>{apartment?.name}</Text>
          <Text style={styles.aptLocation}>📍 {apartment?.address?.locality}, {apartment?.address?.city}</Text>
        </View>

        <Text style={styles.note}>
          ⚠️ This is a visit booking only — not a rental or purchase reservation.
        </Text>

        {/* Tower/Flat (Optional) */}
        <View style={styles.row}>
          <CustomInput label="Tower (Optional)" placeholder="e.g. Tower A" value={form.tower} onChangeText={v => update('tower', v)} style={styles.halfInput} />
          <CustomInput label="Flat No. (Optional)" placeholder="e.g. 204" value={form.flat} onChangeText={v => update('flat', v)} style={styles.halfInput} />
        </View>

        {/* Visit Date */}
        <Text style={styles.fieldLabel}>Select Visit Date *</Text>
        {errors.visitDate && <Text style={styles.errorText}>{errors.visitDate}</Text>}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateList}>
          {dateOptions.map(d => (
            <TouchableOpacity
              key={d.value}
              style={[styles.dateChip, form.visitDate === d.value && styles.dateChipActive]}
              onPress={() => update('visitDate', d.value)}
            >
              <Text style={[styles.dateChipText, form.visitDate === d.value && styles.dateChipTextActive]}>{d.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Time Slot */}
        <Text style={styles.fieldLabel}>Select Time Slot *</Text>
        {errors.timeSlot && <Text style={styles.errorText}>{errors.timeSlot}</Text>}
        <View style={styles.timeGrid}>
          {TIME_SLOTS.map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.timeChip, form.timeSlot === t && styles.timeChipActive]}
              onPress={() => update('timeSlot', t)}
            >
              <Text style={[styles.timeChipText, form.timeSlot === t && styles.timeChipTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Visitors */}
        <Text style={styles.fieldLabel}>Number of Visitors *</Text>
        <View style={styles.visitorsRow}>
          {['1', '2', '3', '4', '5+'].map(v => (
            <TouchableOpacity
              key={v}
              style={[styles.visitorChip, form.visitors === v && styles.visitorChipActive]}
              onPress={() => update('visitors', v)}
            >
              <Text style={[styles.visitorChipText, form.visitors === v && styles.visitorChipTextActive]}>{v}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Personal Details */}
        <CustomInput label="Your Name *" placeholder="Full name" value={form.name} onChangeText={v => update('name', v)} error={errors.name} />
        <CustomInput label="Mobile Number *" placeholder="10-digit number" value={form.phone} onChangeText={v => update('phone', v)} error={errors.phone} keyboardType="phone-pad" />
        <CustomInput label="Additional Message (Optional)" placeholder="Any specific requirement or question..." value={form.message} onChangeText={v => update('message', v)} multiline numberOfLines={3} />

        <CustomButton title="Confirm Visit Booking" onPress={handleSubmit} loading={loading} />
        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  scroll: { paddingHorizontal: SPACING.base, paddingTop: SPACING.md },
  aptInfo: { backgroundColor: COLORS.inputBg, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.md },
  aptName: { fontSize: FONT_SIZES.lg, fontFamily: FONTS.bold, color: COLORS.text, fontWeight: '700' },
  aptLocation: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  note: { backgroundColor: '#FEF9C3', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg, fontSize: FONT_SIZES.sm, color: '#854D0E', lineHeight: 20 },
  row: { flexDirection: 'row', gap: SPACING.md },
  halfInput: { flex: 1, marginBottom: 0 },
  fieldLabel: { fontSize: FONT_SIZES.sm, fontFamily: FONTS.medium, color: COLORS.text, fontWeight: '600', marginBottom: SPACING.sm, marginTop: SPACING.md },
  errorText: { fontSize: FONT_SIZES.xs, color: COLORS.error, marginBottom: SPACING.sm },
  dateList: { gap: SPACING.sm, paddingBottom: SPACING.sm },
  dateChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.lg, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.inputBg },
  dateChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  dateChipText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, fontFamily: FONTS.medium },
  dateChipTextActive: { color: COLORS.white, fontFamily: FONTS.bold, fontWeight: '700' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  timeChip: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.inputBg },
  timeChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  timeChipText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  timeChipTextActive: { color: COLORS.white, fontFamily: FONTS.bold, fontWeight: '700' },
  visitorsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  visitorChip: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.inputBg },
  visitorChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  visitorChipText: { fontSize: FONT_SIZES.base, color: COLORS.textSecondary, fontFamily: FONTS.medium },
  visitorChipTextActive: { color: COLORS.white, fontFamily: FONTS.bold, fontWeight: '700' },
});

export default BookingScreen;
