import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, RADIUS } from '../../constants/spacing';
import CustomButton from '../../components/CustomButton';
import { formatDate } from '../../utils/helpers';

const BookingConfirmScreen = ({ navigation, route }) => {
  const { booking } = route.params || {};

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Text style={styles.icon}>✓</Text>
        </View>
        <Text style={styles.title}>Booking Submitted!</Text>
        <Text style={styles.subtitle}>
          Your visit request has been sent to the partner. You'll be notified once it's confirmed.
        </Text>

        {booking && (
          <View style={styles.detailCard}>
            <Text style={styles.aptName}>{booking.apartmentName}</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Visit Date</Text>
              <Text style={styles.detailValue}>{formatDate(booking.visitDate)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time Slot</Text>
              <Text style={styles.detailValue}>{booking.timeSlot}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Visitors</Text>
              <Text style={styles.detailValue}>{booking.visitors}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Pending Confirmation</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.actions}>
          <CustomButton title="View My Bookings" onPress={() => navigation.navigate('MainTabs', { screen: 'Bookings' })} />
          <CustomButton title="Back to Home" variant="outline" onPress={() => navigation.navigate('MainTabs', { screen: 'Home' })} style={styles.homeBtn} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1, alignItems: 'center', paddingHorizontal: SPACING.base, paddingTop: SPACING.xxxl },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#DCFCE7',
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.xl,
  },
  icon: { fontSize: 36, color: COLORS.success },
  title: { fontSize: FONT_SIZES.xxl, fontFamily: FONTS.bold, color: COLORS.text, fontWeight: '700', textAlign: 'center', marginBottom: SPACING.md },
  subtitle: { fontSize: FONT_SIZES.base, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: SPACING.xl },
  detailCard: { width: '100%', backgroundColor: COLORS.background, borderRadius: RADIUS.xl, padding: SPACING.base, marginBottom: SPACING.xl },
  aptName: { fontSize: FONT_SIZES.lg, fontFamily: FONTS.bold, color: COLORS.text, fontWeight: '700', marginBottom: SPACING.md },
  detailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  detailLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  detailValue: { fontSize: FONT_SIZES.sm, color: COLORS.text, fontFamily: FONTS.medium },
  statusBadge: { backgroundColor: '#FEF3C7', borderRadius: RADIUS.sm, paddingHorizontal: SPACING.sm, paddingVertical: 2 },
  statusText: { fontSize: FONT_SIZES.xs, color: '#B45309', fontFamily: FONTS.bold, fontWeight: '700' },
  actions: { width: '100%', gap: SPACING.md },
  homeBtn: { marginTop: 0 },
});

export default BookingConfirmScreen;
