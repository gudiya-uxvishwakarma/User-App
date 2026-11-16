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

const SaleScreen = ({ navigation }) => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);

  useEffect(() => {
    apartmentService.getSaleListings()
      .then(res => setApartments(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingComponent fullScreen />;

  return (
    <SafeAreaView style={styles.safe}>
      <CustomHeader
        title="Apartments for Sale"
        onBack={() => navigation.goBack()}
        rightComponent={<Text style={styles.filterIcon} onPress={() => setFilterVisible(true)}>⚙</Text>}
      />
      {apartments.length === 0 ? (
        <EmptyState icon="🏠" title="No sale listings" message="Check back soon for new properties for sale" />
      ) : (
        <FlatList
          data={apartments}
          keyExtractor={i => i.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => <Text style={styles.count}>{apartments.length} properties for sale</Text>}
          renderItem={({ item }) => (
            <ApartmentCard
              apartment={item}
              onPress={() => navigation.navigate('ApartmentDetail', { apartment: item })}
            />
          )}
        />
      )}
      <FilterModal visible={filterVisible} onClose={() => setFilterVisible(false)} onApply={() => setFilterVisible(false)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  list: { paddingHorizontal: SPACING.base, paddingTop: SPACING.md },
  count: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: SPACING.md },
  filterIcon: { fontSize: 22, color: COLORS.text },
});

export default SaleScreen;
