import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { FONTS, FONT_SIZES } from '../constants/typography';
import { SPACING, RADIUS, SHADOW } from '../constants/spacing';
import { formatDate, getStatusColor, capitalize } from '../utils/helpers';

const BookingCard = ({ booking, onPress, style }) => {
  const statusColor = getStatusColor(booking.status);

  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.9}>
      <Image
        source={{ uri: booking.apartmentImage }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>{booking.apartmentName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: `${statusColor}22` }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>{capitalize(booking.status)}</Text>
          </View>
        </View>
        {(booking.tower || booking.flat) && (
          <Text style={styles.flat}>
            {booking.tower ? `${booking.tower}` : ''}{booking.flat ? ` • Flat ${booking.flat}` : ''}
          </Text>
        )}
        <Text style={styles.date}>📅 {formatDate(booking.visitDate)} at {booking.timeSlot}</Text>
        <Text style={styles.visitors}>👥 {booking.visitors} visitor{booking.visitors > 1 ? 's' : ''}</Text>
        {!!booking.partnerRemarks && (
          <View style={styles.remarkBox}>
            <Text style={styles.remarkLabel}>Partner Note: </Text>
            <Text style={styles.remarkText}>{booking.partnerRemarks}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...SHADOW.sm,
  },
  image: { width: 90, height: 90 },
  info: { flex: 1, padding: SPACING.md, justifyContent: 'center' },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: SPACING.xs },
  name: { flex: 1, fontSize: FONT_SIZES.base, fontFamily: FONTS.bold, color: COLORS.text, fontWeight: '700', marginRight: SPACING.sm },
  statusBadge: {
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  statusText: { fontSize: FONT_SIZES.xs, fontFamily: FONTS.bold, fontWeight: '700' },
  flat: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: 2 },
  date: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: 2 },
  visitors: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  remarkBox: { flexDirection: 'row', flexWrap: 'wrap', marginTop: SPACING.xs, backgroundColor: '#F0FDF4', borderRadius: RADIUS.sm, padding: SPACING.xs },
  remarkLabel: { fontSize: FONT_SIZES.xs, color: COLORS.success, fontFamily: FONTS.bold, fontWeight: '700' },
  remarkText: { fontSize: FONT_SIZES.xs, color: COLORS.text },
});

export default BookingCard;
