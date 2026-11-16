import React, { useState } from 'react';
import {
  Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { FONTS, FONT_SIZES } from '../constants/typography';
import { SPACING, RADIUS } from '../constants/spacing';
import { BHK_TYPES, AMENITIES_LIST } from '../constants/index';
import CustomButton from './CustomButton';
import CustomInput from './CustomInput';

const FilterModal = ({ visible, onClose, onApply, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    city: initialFilters.city || '',
    locality: initialFilters.locality || '',
    bhk: initialFilters.bhk || '',
    listingType: initialFilters.listingType || '',
    minPrice: initialFilters.minPrice || '',
    maxPrice: initialFilters.maxPrice || '',
    amenities: initialFilters.amenities || [],
    sortBy: initialFilters.sortBy || 'latest',
  });

  const update = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));

  const toggleAmenity = (a) => {
    const list = filters.amenities.includes(a)
      ? filters.amenities.filter(x => x !== a)
      : [...filters.amenities, a];
    update('amenities', list);
  };

  const clear = () => setFilters({
    city: '', locality: '', bhk: '', listingType: '',
    minPrice: '', maxPrice: '', amenities: [], sortBy: 'latest',
  });

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filters</Text>
          <TouchableOpacity onPress={onClose}><Text style={styles.close}>✕</Text></TouchableOpacity>
        </View>
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          <CustomInput label="City" placeholder="e.g. Bangalore" value={filters.city} onChangeText={v => update('city', v)} />
          <CustomInput label="Locality / Area" placeholder="e.g. Koramangala" value={filters.locality} onChangeText={v => update('locality', v)} />

          <Text style={styles.sectionTitle}>Listing Type</Text>
          <View style={styles.chipRow}>
            {['all', 'rent', 'sale'].map(t => (
              <TouchableOpacity key={t} style={[styles.chip, filters.listingType === (t === 'all' ? '' : t) && styles.chipActive]} onPress={() => update('listingType', t === 'all' ? '' : t)}>
                <Text style={[styles.chipText, filters.listingType === (t === 'all' ? '' : t) && styles.chipTextActive]}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>BHK Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {BHK_TYPES.map(b => (
              <TouchableOpacity key={b} style={[styles.chip, filters.bhk === b && styles.chipActive]} onPress={() => update('bhk', filters.bhk === b ? '' : b)}>
                <Text style={[styles.chipText, filters.bhk === b && styles.chipTextActive]}>{b}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Budget Range</Text>
          <View style={styles.priceRow}>
            <CustomInput
              placeholder="Min (₹)" value={filters.minPrice} onChangeText={v => update('minPrice', v)}
              keyboardType="numeric" style={styles.priceInput}
            />
            <Text style={styles.priceSep}>–</Text>
            <CustomInput
              placeholder="Max (₹)" value={filters.maxPrice} onChangeText={v => update('maxPrice', v)}
              keyboardType="numeric" style={styles.priceInput}
            />
          </View>

          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {AMENITIES_LIST.map(a => (
              <TouchableOpacity key={a} style={[styles.amenityChip, filters.amenities.includes(a) && styles.chipActive]} onPress={() => toggleAmenity(a)}>
                <Text style={[styles.chipText, filters.amenities.includes(a) && styles.chipTextActive]}>{a}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Sort By</Text>
          <View style={styles.chipRow}>
            {[['latest', 'Latest'], ['price_asc', 'Price ↑'], ['price_desc', 'Price ↓']].map(([v, l]) => (
              <TouchableOpacity key={v} style={[styles.chip, filters.sortBy === v && styles.chipActive]} onPress={() => update('sortBy', v)}>
                <Text style={[styles.chipText, filters.sortBy === v && styles.chipTextActive]}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ height: 100 }} />
        </ScrollView>
        <View style={styles.footer}>
          <CustomButton title="Clear All" variant="outline" onPress={clear} style={styles.clearBtn} />
          <CustomButton title="Apply Filters" onPress={() => { onApply(filters); onClose(); }} style={styles.applyBtn} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.base, paddingVertical: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: FONT_SIZES.xl, fontFamily: FONTS.bold, color: COLORS.text, fontWeight: '700' },
  close: { fontSize: 20, color: COLORS.textSecondary, padding: SPACING.xs },
  body: { flex: 1, paddingHorizontal: SPACING.base, paddingTop: SPACING.md },
  sectionTitle: { fontSize: FONT_SIZES.base, fontFamily: FONTS.bold, color: COLORS.text, fontWeight: '700', marginBottom: SPACING.sm, marginTop: SPACING.md },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  chip: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.round, borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: COLORS.inputBg,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, fontFamily: FONTS.medium },
  chipTextActive: { color: COLORS.white, fontFamily: FONTS.bold, fontWeight: '700' },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  amenityChip: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: RADIUS.round, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.inputBg,
  },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  priceInput: { flex: 1, marginBottom: 0 },
  priceSep: { fontSize: FONT_SIZES.lg, color: COLORS.textSecondary, fontFamily: FONTS.bold },
  footer: {
    flexDirection: 'row', gap: SPACING.md, paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  clearBtn: { flex: 1 },
  applyBtn: { flex: 2 },
});

export default FilterModal;
