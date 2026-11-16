import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING } from '../../constants/spacing';
import CustomHeader from '../../components/CustomHeader';
import ApartmentCard from '../../components/ApartmentCard';
import FilterModal from '../../components/FilterModal';
import LoadingComponent from '../../components/LoadingComponent';
import EmptyState from '../../components/EmptyState';
import { apartmentService } from '../../services/apartmentService';

const TITLE_MAP = {
  featured: 'Featured Apartments',
  popular: 'Popular Apartments',
  recent: 'Recently Added',
  rent: 'Apartments for Rent',
  sale: 'Apartments for Sale',
};

const ApartmentListScreen = ({ navigation, route }) => {
  const { type = 'all', title } = route.params || {};
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let res;
      if (type === 'featured') res = await apartmentService.getFeatured();
      else if (type === 'popular') res = await apartmentService.getPopular();
      else if (type === 'recent') res = await apartmentService.getRecent();
      else if (type === 'rent') res = await apartmentService.getRentListings();
      else if (type === 'sale') res = await apartmentService.getSaleListings();
      else res = await apartmentService.getAll();
      setApartments(res.data || []);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingComponent fullScreen />;

  return (
    <SafeAreaView style={styles.safe}>
      <CustomHeader
        title={title || TITLE_MAP[type] || 'All Apartments'}
        onBack={() => navigation.goBack()}
        rightComponent={
          <Text style={{ fontSize: 22 }} onPress={() => setFilterVisible(true)}>⚙</Text>
        }
      />
      {apartments.length === 0 ? (
        <EmptyState icon="🏠" title="No apartments found" message="Check back later or adjust your filters" />
      ) : (
        <FlatList
          data={apartments}
          keyExtractor={i => i.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <Text style={styles.count}>{apartments.length} properties</Text>
          )}
          renderItem={({ item }) => (
            <ApartmentCard
              apartment={item}
              onPress={() => navigation.navigate('ApartmentDetail', { apartment: item })}
            />
          )}
        />
      )}
      <FilterModal visible={filterVisible} onClose={() => setFilterVisible(false)} onApply={(f) => { setFilterVisible(false); }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  list: { paddingHorizontal: SPACING.base, paddingTop: SPACING.md },
  count: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: SPACING.md, fontFamily: FONTS.medium },
});

export default ApartmentListScreen;
