import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, FlatList, StyleSheet, StatusBar, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, RADIUS, SHADOW } from '../../constants/spacing';
import SearchBar from '../../components/SearchBar';
import FeaturedApartmentCard from '../../components/FeaturedApartmentCard';
import ApartmentCard from '../../components/ApartmentCard';
import EventCard from '../../components/EventCard';
import LoadingComponent from '../../components/LoadingComponent';
import EmptyState from '../../components/EmptyState';
import { apartmentService } from '../../services/apartmentService';
import { eventService } from '../../services/eventService';
import { useApp } from '../../context/AppContext';

const SectionHeader = ({ title, onSeeAll }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {onSeeAll && (
      <TouchableOpacity onPress={onSeeAll}>
        <Text style={styles.seeAll}>See All →</Text>
      </TouchableOpacity>
    )}
  </View>
);

const QuickAction = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.qaIcon}><Text style={styles.qaIconText}>{icon}</Text></View>
    <Text style={styles.qaLabel}>{label}</Text>
  </TouchableOpacity>
);

const HomeScreen = ({ navigation }) => {
  const { user, unreadNotificationsCount } = useApp();
  const [featured, setFeatured] = useState([]);
  const [popular, setPopular] = useState([]);
  const [recent, setRecent] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [featRes, popRes, recRes, evtRes] = await Promise.all([
        apartmentService.getFeatured(),
        apartmentService.getPopular(),
        apartmentService.getRecent(),
        eventService.getAll(),
      ]);
      setFeatured(featRes.data || []);
      setPopular(popRes.data || []);
      setRecent(recRes.data || []);
      setEvents(evtRes.data || []);
    } catch (e) {
      console.warn('Home fetch error:', e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, []);
  const onRefresh = useCallback(() => { setRefreshing(true); fetchData(); }, []);

  if (loading) return <LoadingComponent fullScreen message="Loading properties..." />;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning 👋</Text>
            <Text style={styles.userName}>{user?.name || 'Welcome!'}</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn} onPress={() => navigation.navigate('Notifications')}>
            <Text style={styles.notifIcon}>🔔</Text>
            {unreadNotificationsCount > 0 && (
              <View style={styles.badge}><Text style={styles.badgeText}>{unreadNotificationsCount}</Text></View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchSection}>
          <SearchBar
            placeholder="Search apartments, cities, localities..."
            onFocus={() => navigation.navigate('Search')}
            editable={false}
            onFilterPress={() => navigation.navigate('Search')}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <QuickAction icon="🏢" label="Rent" onPress={() => navigation.navigate('Rent')} />
          <QuickAction icon="🏠" label="Sale" onPress={() => navigation.navigate('Sale')} />
          <QuickAction icon="📅" label="Events" onPress={() => navigation.navigate('Events')} />
          <QuickAction icon="🔍" label="Nearby" onPress={() => navigation.navigate('Search')} />
        </View>

        {/* Featured Apartments */}
        {featured.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Featured Apartments" onSeeAll={() => navigation.navigate('ApartmentList', { type: 'featured' })} />
            <FlatList
              data={featured}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={i => i.id}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <FeaturedApartmentCard
                  apartment={item}
                  onPress={() => navigation.navigate('ApartmentDetail', { apartment: item })}
                />
              )}
            />
          </View>
        )}

        {/* Popular Apartments */}
        {popular.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Popular Apartments" onSeeAll={() => navigation.navigate('ApartmentList', { type: 'popular' })} />
            {popular.slice(0, 3).map(apt => (
              <ApartmentCard
                key={apt.id}
                apartment={apt}
                onPress={() => navigation.navigate('ApartmentDetail', { apartment: apt })}
              />
            ))}
          </View>
        )}

        {/* Rent Apartments */}
        <View style={styles.section}>
          <SectionHeader title="Apartments for Rent" onSeeAll={() => navigation.navigate('Rent')} />
          {recent.filter(a => a.listingType?.includes('rent')).slice(0, 2).map(apt => (
            <ApartmentCard
              key={apt.id}
              apartment={apt}
              onPress={() => navigation.navigate('ApartmentDetail', { apartment: apt })}
            />
          ))}
        </View>

        {/* Sale Apartments */}
        <View style={styles.section}>
          <SectionHeader title="Apartments for Sale" onSeeAll={() => navigation.navigate('Sale')} />
          {recent.filter(a => a.listingType?.includes('sale')).slice(0, 2).map(apt => (
            <ApartmentCard
              key={apt.id}
              apartment={apt}
              onPress={() => navigation.navigate('ApartmentDetail', { apartment: apt })}
            />
          ))}
        </View>

        {/* Recently Added */}
        {recent.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Recently Added" onSeeAll={() => navigation.navigate('ApartmentList', { type: 'recent' })} />
            <FlatList
              data={recent.slice(0, 4)}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={i => i.id}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item }) => (
                <FeaturedApartmentCard
                  apartment={item}
                  onPress={() => navigation.navigate('ApartmentDetail', { apartment: item })}
                />
              )}
            />
          </View>
        )}

        {/* Upcoming Events */}
        {events.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Upcoming Events" onSeeAll={() => navigation.navigate('Events')} />
            {events.slice(0, 2).map(evt => (
              <EventCard
                key={evt.id}
                event={evt}
                onPress={() => navigation.navigate('EventDetail', { event: evt })}
              />
            ))}
          </View>
        )}

        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.base, paddingTop: SPACING.md, paddingBottom: SPACING.sm },
  greeting: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, fontFamily: FONTS.regular },
  userName: { fontSize: FONT_SIZES.xl, fontFamily: FONTS.bold, color: COLORS.text, fontWeight: '700' },
  notifBtn: { position: 'relative', width: 44, height: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, ...SHADOW.sm },
  notifIcon: { fontSize: 20 },
  badge: { position: 'absolute', top: 6, right: 6, backgroundColor: COLORS.error, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontSize: 9, color: COLORS.white, fontFamily: FONTS.bold, fontWeight: '700' },
  searchSection: { paddingHorizontal: SPACING.base, paddingBottom: SPACING.md },
  quickActions: { flexDirection: 'row', paddingHorizontal: SPACING.base, justifyContent: 'space-between', marginBottom: SPACING.md },
  quickAction: { alignItems: 'center', flex: 1 },
  qaIcon: { width: 52, height: 52, borderRadius: RADIUS.lg, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', ...SHADOW.sm, marginBottom: SPACING.xs },
  qaIconText: { fontSize: 24 },
  qaLabel: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, fontFamily: FONTS.medium },
  section: { paddingHorizontal: SPACING.base, marginBottom: SPACING.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontFamily: FONTS.bold, color: COLORS.text, fontWeight: '700' },
  seeAll: { fontSize: FONT_SIZES.sm, color: COLORS.primary, fontFamily: FONTS.medium },
  horizontalList: { paddingRight: SPACING.base },
});

export default HomeScreen;
