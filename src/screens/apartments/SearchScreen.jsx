import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING } from '../../constants/spacing';
import SearchBar from '../../components/SearchBar';
import ApartmentCard from '../../components/ApartmentCard';
import FilterModal from '../../components/FilterModal';
import LoadingComponent from '../../components/LoadingComponent';
import EmptyState from '../../components/EmptyState';
import { apartmentService } from '../../services/apartmentService';
import { useApp } from '../../context/AppContext';

const SearchScreen = ({ navigation }) => {
  const { searchFilters, updateFilters } = useApp();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async (filters) => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await apartmentService.getAll(filters);
      setResults(res.data || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load all on first visit
    doSearch(searchFilters);
  }, []);

  const handleSearch = () => doSearch(searchFilters);
  const handleApplyFilters = (filters) => { updateFilters(filters); doSearch(filters); };

  const activeFilterCount = Object.values(searchFilters).filter(v =>
    v !== '' && !(Array.isArray(v) && v.length === 0) && v !== 'latest'
  ).length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Search Apartments</Text>
        <SearchBar
          value={searchFilters.search}
          onChangeText={v => updateFilters({ search: v })}
          onSubmit={handleSearch}
          onFilterPress={() => setFilterVisible(true)}
          style={styles.searchBar}
        />
        {activeFilterCount > 0 && (
          <View style={styles.filterInfo}>
            <Text style={styles.filterInfoText}>{activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active</Text>
            <TouchableOpacity onPress={() => { updateFilters({ search: '', city: '', locality: '', bhk: '', listingType: '', minPrice: '', maxPrice: '', amenities: [], sortBy: 'latest' }); doSearch({}); }}>
              <Text style={styles.clearFilters}>Clear All</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {loading ? (
        <LoadingComponent message="Searching..." />
      ) : results.length === 0 && searched ? (
        <EmptyState
          icon="🔍"
          title="No results found"
          message="Try adjusting your search filters"
          actionLabel="Clear Filters"
          onAction={() => { updateFilters({ search: '', city: '', bhk: '', listingType: '' }); doSearch({}); }}
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={i => i.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <Text style={styles.resultCount}>{results.length} properties found</Text>
          )}
          renderItem={({ item }) => (
            <ApartmentCard
              apartment={item}
              onPress={() => navigation.navigate('ApartmentDetail', { apartment: item })}
            />
          )}
        />
      )}

      <FilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={handleApplyFilters}
        initialFilters={searchFilters}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { backgroundColor: COLORS.white, paddingHorizontal: SPACING.base, paddingTop: SPACING.md, paddingBottom: SPACING.md },
  title: { fontSize: FONT_SIZES.xl, fontFamily: FONTS.bold, color: COLORS.text, fontWeight: '700', marginBottom: SPACING.md },
  searchBar: {},
  filterInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: SPACING.sm },
  filterInfoText: { fontSize: FONT_SIZES.sm, color: COLORS.primary, fontFamily: FONTS.medium },
  clearFilters: { fontSize: FONT_SIZES.sm, color: COLORS.error, fontFamily: FONTS.medium },
  list: { paddingHorizontal: SPACING.base, paddingTop: SPACING.md },
  resultCount: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: SPACING.md, fontFamily: FONTS.medium },
});

export default SearchScreen;
