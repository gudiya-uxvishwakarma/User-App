import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { FONTS, FONT_SIZES } from '../constants/typography';
import { SPACING, RADIUS, SHADOW } from '../constants/spacing';
import { formatDate } from '../utils/helpers';

const EventCard = ({ event, onPress, style }) => (
  <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.9}>
    <Image source={{ uri: event.bannerImage }} style={styles.banner} resizeMode="cover" />
    <View style={styles.info}>
      <View style={styles.topRow}>
        <View style={styles.categoryBadge}>
          <Text style={styles.category}>{event.category}</Text>
        </View>
        {event.entryFee && <Text style={styles.fee}>₹{event.entryFee}</Text>}
        {!event.entryFee && <Text style={styles.free}>Free</Text>}
      </View>
      <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
      <Text style={styles.meta}>📅 {formatDate(event.date)}</Text>
      <Text style={styles.meta}>🕐 {event.startTime} – {event.endTime}</Text>
      <Text style={styles.location} numberOfLines={1}>📍 {event.location}</Text>
      {event.registrationRequired && (
        <View style={styles.regBadge}>
          <Text style={styles.regText}>Registration Required</Text>
        </View>
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...SHADOW.sm,
  },
  banner: { width: '100%', height: 140 },
  info: { padding: SPACING.md },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.sm },
  categoryBadge: {
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  category: { fontSize: FONT_SIZES.xs, color: COLORS.primary, fontFamily: FONTS.medium },
  fee: { fontSize: FONT_SIZES.sm, color: COLORS.primary, fontFamily: FONTS.bold, fontWeight: '700' },
  free: { fontSize: FONT_SIZES.xs, color: COLORS.success, fontFamily: FONTS.medium },
  title: { fontSize: FONT_SIZES.base, fontFamily: FONTS.bold, color: COLORS.text, fontWeight: '700', marginBottom: SPACING.sm },
  meta: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: 2 },
  location: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  regBadge: {
    marginTop: SPACING.sm,
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  regText: { fontSize: FONT_SIZES.xs, color: '#B45309', fontFamily: FONTS.medium },
});

export default EventCard;
