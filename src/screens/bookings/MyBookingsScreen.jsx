import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, RADIUS } from '../../constants/spacing';
import BookingCard from '../../components/BookingCard';
import LoadingComponent from '../../components/LoadingComponent';
import EmptyState from '../../components/EmptyState';
import { bookingService } from '../../services/bookingService';

const TABS = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

const MyBookingsScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('All');

  const fetchBookings = async () => {
    try {
      const res = await bookingService.getMyBookings();
      setBookings(res.data || []);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);
  const onRefresh = useCallback(() => { setRefreshing(true); fetchBookings(); }, []);

  const filtered = activeTab === 'All'
    ? bookings
    : bookings.filter(b => b.status?.toLowerCase() === activeTab.toLowerCase());

  if (loading) return <LoadingComponent fullScreen />;

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>My Bookings</Text>
      <View style={styles.tabs}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          icon="📅"
          title={`No ${activeTab.toLowerCase()} bookings`}
          message="Book a property visit to get started"
          actionLabel="Find Apartments"
          onAction={() => navigation.navigate('Home')}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={i => i.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              onPress={() => navigation.navigate('BookingDetail', { booking: item })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  title: { fontSize: FONT_SIZES.xl, fontFamily: FONTS.bold, color: COLORS.text, fontWeight: '700', paddingHorizontal: SPACING.base, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  tabs: { flexDirection: 'row', paddingHorizontal: SPACING.base, marginBottom: SPACING.md, gap: SPACING.sm },
  tab: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.round, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, fontFamily: FONTS.medium },
  tabTextActive: { color: COLORS.white, fontFamily: FONTS.bold, fontWeight: '700' },
  list: { paddingHorizontal: SPACING.base },
});

export default MyBookingsScreen;
