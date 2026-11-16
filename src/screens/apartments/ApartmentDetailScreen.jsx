import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, RADIUS, SHADOW } from '../../constants/spacing';
import PropertyImageGallery from '../../components/PropertyImageGallery';
import AmenityItem from '../../components/AmenityItem';
import CustomButton from '../../components/CustomButton';
import CustomHeader from '../../components/CustomHeader';
import { formatPrice, formatRent } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const ApartmentDetailScreen = ({ navigation, route }) => {
  const { apartment: initial } = route.params || {};
  const { toggleWishlist, isInWishlist } = useApp();
  const [apt, setApt] = useState(initial);
  const [selectedTower, setSelectedTower] = useState(null);
  const saved = isInWishlist(apt?.id);

  if (!apt) {
    return (
      <SafeAreaView style={styles.safe}>
        <CustomHeader title="Property Details" onBack={() => navigation.goBack()} />
        <Text style={styles.errorText}>Property details not available.</Text>
      </SafeAreaView>
    );
  }

  const allImages = [apt.coverImage, ...(apt.images || [])].filter(Boolean);

  const handleContact = () => {
    if (apt.partnerContact?.phone) {
      Linking.openURL(`tel:${apt.partnerContact.phone}`).catch(() =>
        Alert.alert('Error', 'Cannot make phone call at this time')
      );
    }
  };

  const handleBook = () => {
    navigation.navigate('Booking', { apartment: apt });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* Image Gallery */}
      <View>
        <PropertyImageGallery images={allImages} />
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.wishlistBtn} onPress={() => toggleWishlist(apt)}>
          <Text style={[styles.heart, saved && styles.heartActive]}>{saved ? '♥' : '♡'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header Info */}
        <View style={styles.headerCard}>
          <View style={styles.titleRow}>
            <Text style={styles.aptName}>{apt.name}</Text>
            {apt.rating && (
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>★ {apt.rating}</Text>
              </View>
            )}
          </View>
          <Text style={styles.builderName}>by {apt.builderName}</Text>
          <Text style={styles.address}>📍 {apt.address?.street}, {apt.address?.locality}, {apt.address?.city} - {apt.address?.pincode}</Text>

          {/* Listing Types */}
          <View style={styles.typeRow}>
            {apt.listingType?.map(t => (
              <View key={t} style={[styles.typeBadge, { backgroundColor: t === 'rent' ? '#DCFCE7' : '#EEF2FF' }]}>
                <Text style={[styles.typeText, { color: t === 'rent' ? COLORS.success : COLORS.primary }]}>
                  {t === 'rent' ? '🔑 For Rent' : '🏠 For Sale'}
                </Text>
              </View>
            ))}
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{apt.possession}</Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            {apt.listingType?.includes('sale') && (
              <View style={styles.priceBlock}>
                <Text style={styles.priceLabel}>Sale Price</Text>
                <Text style={styles.priceValue}>{formatPrice(apt.priceRange?.min)} – {formatPrice(apt.priceRange?.max)}</Text>
              </View>
            )}
            {apt.listingType?.includes('rent') && (
              <View style={styles.priceBlock}>
                <Text style={styles.priceLabel}>Monthly Rent</Text>
                <Text style={styles.priceValue}>{formatRent(apt.rentRange?.min)} – {formatRent(apt.rentRange?.max)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Overview */}
        <Section title="Overview">
          <View style={styles.overviewGrid}>
            <InfoRow label="BHK Types" value={apt.bhkOptions?.join(', ')} />
            <InfoRow label="Area" value={`${apt.area?.min}–${apt.area?.max} sq ft`} />
            <InfoRow label="Total Towers" value={String(apt.totalTowers)} />
            <InfoRow label="Total Floors" value={String(apt.totalFloors)} />
            <InfoRow label="Total Flats" value={String(apt.totalFlats)} />
            <InfoRow label="Project Status" value={apt.projectStatus} />
          </View>
        </Section>

        {/* Description */}
        {apt.description && (
          <Section title="About This Property">
            <Text style={styles.description}>{apt.description}</Text>
          </Section>
        )}

        {/* Features */}
        {apt.features?.length > 0 && (
          <Section title="Key Features">
            <View style={styles.featureList}>
              {apt.features.map((f, i) => (
                <View key={i} style={styles.featureItem}>
                  <Text style={styles.featureDot}>✦</Text>
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>
          </Section>
        )}

        {/* Amenities */}
        {apt.amenities?.length > 0 && (
          <Section title="Amenities">
            <View style={styles.amenitiesGrid}>
              {apt.amenities.map(a => <AmenityItem key={a} name={a} />)}
            </View>
          </Section>
        )}

        {/* Towers & Flats */}
        {apt.towers?.length > 0 && (
          <Section title="Towers & Available Flats">
            {apt.towers.map(tower => (
              <View key={tower.id} style={styles.towerCard}>
                <TouchableOpacity style={styles.towerHeader} onPress={() => setSelectedTower(selectedTower === tower.id ? null : tower.id)}>
                  <Text style={styles.towerName}>{tower.name}</Text>
                  <Text style={styles.towerFloors}>{tower.floors} Floors  {selectedTower === tower.id ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {selectedTower === tower.id && (
                  <View style={styles.flatList}>
                    {tower.flats?.map(flat => (
                      <View key={flat.id} style={[styles.flatItem, flat.availability === 'Available' && styles.flatAvailable]}>
                        <View>
                          <Text style={styles.flatNumber}>Flat {flat.number}</Text>
                          <Text style={styles.flatBhk}>{flat.bhk} · {flat.area} sq ft</Text>
                        </View>
                        <View style={styles.flatRight}>
                          {flat.price && <Text style={styles.flatPrice}>{formatPrice(flat.price)}</Text>}
                          <View style={[styles.availBadge, { backgroundColor: flat.availability === 'Available' ? '#DCFCE7' : flat.availability === 'Booked' ? '#FEF3C7' : '#FEE2E2' }]}>
                            <Text style={[styles.availText, { color: flat.availability === 'Available' ? COLORS.success : flat.availability === 'Booked' ? COLORS.warning : COLORS.error }]}>{flat.availability}</Text>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </Section>
        )}

        {/* Nearby Places */}
        {apt.nearbyPlaces?.length > 0 && (
          <Section title="Nearby Places">
            {apt.nearbyPlaces.map((p, i) => (
              <View key={i} style={styles.nearbyItem}>
                <Text style={styles.nearbyName}>{p.name}</Text>
                <View style={styles.nearbyRight}>
                  <View style={styles.nearbyType}><Text style={styles.nearbyTypeText}>{p.type}</Text></View>
                  <Text style={styles.nearbyDist}>{p.distance}</Text>
                </View>
              </View>
            ))}
          </Section>
        )}

        {/* Partner Contact */}
        {apt.partnerContact && (
          <Section title="Contact Partner">
            <View style={styles.contactCard}>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{apt.partnerContact.name}</Text>
                <Text style={styles.contactDetail}>{apt.partnerContact.phone}</Text>
                <Text style={styles.contactDetail}>{apt.partnerContact.email}</Text>
              </View>
              <TouchableOpacity style={styles.callBtn} onPress={handleContact}>
                <Text style={styles.callIcon}>📞</Text>
                <Text style={styles.callText}>Call</Text>
              </TouchableOpacity>
            </View>
          </Section>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomCTA}>
        <TouchableOpacity style={styles.enquireBtn} onPress={handleContact}>
          <Text style={styles.enquireText}>Enquire</Text>
        </TouchableOpacity>
        <CustomButton title="📅 Book a Visit" onPress={handleBook} style={styles.bookBtn} fullWidth={false} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flex: 1 },
  backBtn: {
    position: 'absolute', top: 44, left: SPACING.base, backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', ...SHADOW.sm,
  },
  backArrow: { fontSize: 20, color: COLORS.text },
  wishlistBtn: {
    position: 'absolute', top: 44, right: SPACING.base, backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center', ...SHADOW.sm,
  },
  heart: { fontSize: 20, color: COLORS.textSecondary },
  heartActive: { color: COLORS.error },
  headerCard: { backgroundColor: COLORS.white, padding: SPACING.base, marginBottom: SPACING.sm },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  aptName: { flex: 1, fontSize: FONT_SIZES.xxl, fontFamily: FONTS.bold, color: COLORS.text, fontWeight: '700' },
  ratingBadge: { backgroundColor: '#FEF3C7', borderRadius: RADIUS.sm, paddingHorizontal: SPACING.sm, paddingVertical: 3, marginLeft: SPACING.sm },
  ratingText: { fontSize: FONT_SIZES.sm, color: '#B45309', fontFamily: FONTS.bold, fontWeight: '700' },
  builderName: { fontSize: FONT_SIZES.base, color: COLORS.textSecondary, marginTop: 2, marginBottom: SPACING.sm },
  address: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, lineHeight: 20 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.md },
  typeBadge: { borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs },
  typeText: { fontSize: FONT_SIZES.sm, fontFamily: FONTS.bold, fontWeight: '700' },
  statusBadge: { borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, backgroundColor: '#F3F4F6' },
  statusText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, fontFamily: FONTS.medium },
  priceRow: { flexDirection: 'row', gap: SPACING.xl, marginTop: SPACING.md },
  priceBlock: {},
  priceLabel: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, fontFamily: FONTS.medium },
  priceValue: { fontSize: FONT_SIZES.base, color: COLORS.primary, fontFamily: FONTS.bold, fontWeight: '700', marginTop: 2 },
  section: { backgroundColor: COLORS.white, marginBottom: SPACING.sm, padding: SPACING.base },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontFamily: FONTS.bold, color: COLORS.text, fontWeight: '700', marginBottom: SPACING.md },
  overviewGrid: { gap: SPACING.sm },
  infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: SPACING.xs, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, fontFamily: FONTS.regular },
  infoValue: { fontSize: FONT_SIZES.sm, color: COLORS.text, fontFamily: FONTS.bold, fontWeight: '600' },
  description: { fontSize: FONT_SIZES.base, color: COLORS.textSecondary, lineHeight: 24 },
  featureList: { gap: SPACING.sm },
  featureItem: { flexDirection: 'row', alignItems: 'center' },
  featureDot: { color: COLORS.secondary, marginRight: SPACING.sm },
  featureText: { fontSize: FONT_SIZES.base, color: COLORS.text },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  towerCard: { marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.lg, overflow: 'hidden' },
  towerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.md, backgroundColor: COLORS.inputBg },
  towerName: { fontSize: FONT_SIZES.base, fontFamily: FONTS.bold, color: COLORS.text, fontWeight: '700' },
  towerFloors: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
  flatList: { padding: SPACING.sm },
  flatItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.sm, marginBottom: SPACING.xs, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.border },
  flatAvailable: { borderColor: COLORS.success },
  flatNumber: { fontSize: FONT_SIZES.sm, fontFamily: FONTS.bold, color: COLORS.text, fontWeight: '700' },
  flatBhk: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, marginTop: 2 },
  flatRight: { alignItems: 'flex-end' },
  flatPrice: { fontSize: FONT_SIZES.sm, color: COLORS.primary, fontFamily: FONTS.bold, fontWeight: '700' },
  availBadge: { borderRadius: RADIUS.sm, paddingHorizontal: SPACING.sm, paddingVertical: 2, marginTop: 2 },
  availText: { fontSize: FONT_SIZES.xs, fontFamily: FONTS.medium },
  nearbyItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  nearbyName: { fontSize: FONT_SIZES.base, color: COLORS.text, fontFamily: FONTS.regular },
  nearbyRight: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  nearbyType: { backgroundColor: COLORS.inputBg, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.sm, paddingVertical: 2 },
  nearbyTypeText: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary },
  nearbyDist: { fontSize: FONT_SIZES.sm, color: COLORS.primary, fontFamily: FONTS.medium },
  contactCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  contactInfo: {},
  contactName: { fontSize: FONT_SIZES.base, fontFamily: FONTS.bold, color: COLORS.text, fontWeight: '700' },
  contactDetail: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  callBtn: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#DCFCE7', borderRadius: RADIUS.lg, padding: SPACING.md },
  callIcon: { fontSize: 22 },
  callText: { fontSize: FONT_SIZES.xs, color: COLORS.success, fontFamily: FONTS.medium, marginTop: 2 },
  bottomCTA: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md,
    backgroundColor: COLORS.white, paddingHorizontal: SPACING.base, paddingVertical: SPACING.md,
    borderTopWidth: 1, borderTopColor: COLORS.border, ...SHADOW.lg,
  },
  enquireBtn: { flex: 1, height: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: RADIUS.lg },
  enquireText: { fontSize: FONT_SIZES.base, color: COLORS.primary, fontFamily: FONTS.bold, fontWeight: '700' },
  bookBtn: { flex: 2, height: 48 },
  errorText: { padding: SPACING.xl, textAlign: 'center', color: COLORS.textSecondary },
});

export default ApartmentDetailScreen;
