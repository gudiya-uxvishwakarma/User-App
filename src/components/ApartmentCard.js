import React from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { FONTS, FONT_SIZES } from '../constants/typography';
import { SPACING, RADIUS, SHADOW } from '../constants/spacing';
import { formatPrice, truncate } from '../utils/helpers';
import { useApp } from '../context/AppContext';

const ApartmentCard = ({ apartment, onPress, style }) => {
  const { toggleWishlist, isInWishlist } = useApp();
  const saved = isInWishlist(apartment.id);

  const handleWishlist = async (e) => {
    e.stopPropagation();
    await toggleWishlist(apartment);
  };

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: apartment.coverImage }}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.wishlistBtn} onPress={handleWishlist}>
          <Text style={[styles.heart, saved && styles.heartActive]}>{saved ? '♥' : '♡'}</Text>
        </TouchableOpacity>
        {apartment.isFeatured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>
            {apartment.listingType?.includes('rent') && apartment.listingType?.includes('sale')
              ? 'Rent & Sale'
              : apartment.listingType?.includes('rent') ? 'Rent' : 'Sale'}
          </Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{apartment.name}</Text>
        <Text style={styles.builder} numberOfLines={1}>{apartment.builderName}</Text>
        <Text style={styles.location} numberOfLines={1}>
          📍 {apartment.address?.locality}, {apartment.address?.city}
        </Text>
        <View style={styles.detailRow}>
          <View style={styles.bhkChip}>
            <Text style={styles.bhkText}>{apartment.bhkOptions?.slice(0, 2).join(' | ')}</Text>
          </View>
          <Text style={styles.price}>
            {apartment.listingType?.includes('sale')
              ? formatPrice(apartment.priceRange?.min)
              : `₹${(apartment.rentRange?.min / 1000).toFixed(0)}K/mo`}
          </Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.possession}>{apartment.possession}</Text>
          {!!apartment.rating && (
            <View style={styles.rating}>
              <Text style={styles.star}>★</Text>
              <Text style={styles.ratingText}>{apartment.rating}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    ...SHADOW.md,
  },
  imageContainer: { position: 'relative' },
  image: { width: '100%', height: 180 },
  wishlistBtn: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: { fontSize: 18, color: COLORS.textSecondary },
  heartActive: { color: COLORS.error },
  featuredBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: COLORS.secondary,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  featuredText: { fontSize: FONT_SIZES.xs, color: COLORS.primary, fontFamily: FONTS.bold, fontWeight: '700' },
  typeBadge: {
    position: 'absolute',
    bottom: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  typeText: { fontSize: FONT_SIZES.xs, color: COLORS.white, fontFamily: FONTS.medium },
  info: { padding: SPACING.md },
  name: { fontSize: FONT_SIZES.base, fontFamily: FONTS.bold, color: COLORS.text, fontWeight: '700' },
  builder: { fontSize: FONT_SIZES.sm, fontFamily: FONTS.regular, color: COLORS.textSecondary, marginTop: 2 },
  location: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: SPACING.xs },
  detailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: SPACING.sm },
  bhkChip: {
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  bhkText: { fontSize: FONT_SIZES.xs, color: COLORS.primary, fontFamily: FONTS.medium },
  price: { fontSize: FONT_SIZES.base, fontFamily: FONTS.bold, color: COLORS.primary, fontWeight: '700' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: SPACING.sm },
  possession: { fontSize: FONT_SIZES.xs, color: COLORS.success, fontFamily: FONTS.medium },
  rating: { flexDirection: 'row', alignItems: 'center' },
  star: { color: COLORS.star, marginRight: 2 },
  ratingText: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, fontFamily: FONTS.medium },
});

export default ApartmentCard;
