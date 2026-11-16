import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { FONTS, FONT_SIZES } from '../constants/typography';
import { SPACING, RADIUS, SHADOW } from '../constants/spacing';
import { formatPrice } from '../utils/helpers';

const FeaturedApartmentCard = ({ apartment, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
    <Image source={{ uri: apartment.coverImage }} style={styles.image} resizeMode="cover" />
    <View style={styles.overlay}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Featured</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{apartment.name}</Text>
        <Text style={styles.location} numberOfLines={1}>
          📍 {apartment.address?.locality}, {apartment.address?.city}
        </Text>
        <View style={styles.row}>
          <Text style={styles.price}>
            {formatPrice(apartment.priceRange?.min)} onwards
          </Text>
          {!!apartment.rating && (
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>★ {apartment.rating}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    width: 280,
    height: 200,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginRight: SPACING.md,
    ...SHADOW.md,
  },
  image: { width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.42)',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  badgeText: { fontSize: FONT_SIZES.xs, color: COLORS.primary, fontFamily: FONTS.bold, fontWeight: '700' },
  info: {},
  name: { fontSize: FONT_SIZES.lg, fontFamily: FONTS.bold, color: COLORS.white, fontWeight: '700' },
  location: { fontSize: FONT_SIZES.sm, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: SPACING.sm },
  price: { fontSize: FONT_SIZES.sm, color: COLORS.secondary, fontFamily: FONTS.bold, fontWeight: '700' },
  ratingBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  ratingText: { fontSize: FONT_SIZES.xs, color: COLORS.white, fontFamily: FONTS.medium },
});

export default FeaturedApartmentCard;
