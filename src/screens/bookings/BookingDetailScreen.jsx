import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, RADIUS } from '../../constants/spacing';
import CustomHeader from '../../components/CustomHeader';
import CustomButton from '../../components/CustomButton';
import { formatDate, getStatusColor, capitalize } from '../../utils/helpers';
import { bookingService } from '../../services/bookingService';
import { TIME_SLOTS } from '../../constants/index';

const BookingDetailScreen = ({ navigation, route }) => {
  const { booking: initial } = route.params || {};
  const [booking, setBooking] = useState(initial);
  const [loading, setLoading] = useState(false);

  if (!booking) return null;

  const statusColor = getStatusColor(booking.status);

  const handleCancel = () => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this visit booking?', [
      { text: 'No' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: async () => {
          setLoading(true);
          try {
            await bookingService.cancel(booking.id, 'User cancelled');
            setBooking(b => ({ ...b, status: 'cancelled' }));
            Alert.alert('Cancelled', 'Your booking has been cancelled.');
          } catch { Alert.alert('Error', 'Could not cancel at this time.'); }
          finally { setLoading(false); }
        },
      },
    ]);
  };

  const handleReschedule = () => {
    Alert.alert('Reschedule', 'This would open a reschedule form (coming with backend integration).');
  };

  const canCancel = ['pending', 'confirmed'].includes(booking.status);
  const canReschedule = ['pending', 'confirmed'].includes(booking.status);

  return (
    <SafeAreaView style={styles.safe}>
      <CustomHeader title="Booking Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: `${statusColor}15` }]}>
          <Text style={styles.statusIcon}>
            {booking.status === 'confirmed' ? '✅' : booking.status === 'pending' ? '⏳' : booking.status === 'cancelled' ? '❌' : booking.status === 'completed' ? '🏁' : '🔄'}
          </Text>
          <View>
            <Text style={[styles.statusTitle, { color: statusColor }]}>{capitalize(booking.status)}</Text>
            {booking.partnerRemarks && <Text style={styles.statusRemark}>{booking.partnerRemarks}</Text>}
          </View>
        </View>

        {/* Apartment */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Property</Text>
          <Text style={styles.aptName}>{booking.apartmentName}</Text>
          {booking.tower && <Text style={styles.detail}>{booking.tower}{booking.flat ? ` · Flat ${booking.flat}` : ''}</Text>}
        </View>

        {/* Visit Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Visit Details</Text>
          <DetailRow label="Date" value={formatDate(booking.visitDate)} />
          <DetailRow label="Time" value={booking.timeSlot} />
          <DetailRow label="Visitors" value={`${booking.visitors} person${booking.visitors > 1 ? 's' : ''}`} />
        </View>

        {/* Contact */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Information</Text>
          <DetailRow label="Name" value={booking.userName} />
          <DetailRow label="Phone" value={booking.userPhone} />
        </View>

        {booking.message ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your Message</Text>
            <Text style={styles.messageText}>{booking.message}</Text>
          </View>
        ) : null}

        {/* Booking ID */}
        <Text style={styles.bookingId}>Booking ID: {booking.id}</Text>
        <Text style={styles.createdAt}>Submitted: {formatDate(booking.createdAt)}</Text>

        {/* Actions */}
        {(canCancel || canReschedule) && (
          <View style={styles.actions}>
            {canReschedule && (
              <CustomButton title="Reschedule" variant="outline" onPress={handleReschedule} style={styles.actionBtn} />
            )}
            {canCancel && (
              <CustomButton title="Cancel Booking" variant="danger" onPress={handleCancel} loading={loading} style={styles.actionBtn} />
            )}
          </View>
        )}

        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingHorizontal: SPACING.base, paddingTop: SPACING.md },
  statusBanner: { flexDirection: 'row', alignItems: 'center', borderRadius: RADIUS.xl, padding: SPACING.base, marginBottom: SPACING.md, gap: SPACING.md },
  statusIcon: { fontSize: 32 },
  statusTitle: { fontSize: FONT_SIZES.xl, fontFamily: FONTS.bold, fontWeight: '700' },
  statusRemark: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2, lineHeight: 18 },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.base, marginBottom: SPACING.md },
  cardTitle: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, fontFamily: FONTS.medium, marginBottom: SPACING.md, textTransform: 'uppercase', letterSpacing: 0.5 },
  aptName: { fontSize: FONT_SIZES.lg, fontFamily: FONTS.bold, color: COLORS.text, fontWeight: '700' },
  detail: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 4 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  detailLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  detailValue: { fontSize: FONT_SIZES.sm, color: COLORS.text, fontFamily: FONTS.medium },
  messageText: { fontSize: FONT_SIZES.base, color: COLORS.textSecondary, lineHeight: 22 },
  bookingId: { fontSize: FONT_SIZES.xs, color: COLORS.textLight, textAlign: 'center', marginBottom: 2 },
  createdAt: { fontSize: FONT_SIZES.xs, color: COLORS.textLight, textAlign: 'center', marginBottom: SPACING.xl },
  actions: { gap: SPACING.md },
  actionBtn: {},
});

export default BookingDetailScreen;
