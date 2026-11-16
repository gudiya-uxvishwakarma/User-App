import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { FONT_SIZES } from '../../constants/typography';
import { SPACING } from '../../constants/spacing';
import CustomHeader from '../../components/CustomHeader';
import EventCard from '../../components/EventCard';
import LoadingComponent from '../../components/LoadingComponent';
import EmptyState from '../../components/EmptyState';
import { eventService } from '../../services/eventService';

const EventsScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventService.getAll()
      .then(res => setEvents(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingComponent fullScreen />;

  return (
    <SafeAreaView style={styles.safe}>
      <CustomHeader title="Upcoming Events" onBack={() => navigation.goBack()} />
      {events.length === 0 ? (
        <EmptyState icon="🎉" title="No upcoming events" message="Check back soon for apartment events" />
      ) : (
        <FlatList
          data={events}
          keyExtractor={i => i.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => <Text style={styles.count}>{events.length} upcoming events</Text>}
          renderItem={({ item }) => (
            <EventCard event={item} onPress={() => navigation.navigate('EventDetail', { event: item })} />
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  list: { paddingHorizontal: SPACING.base, paddingTop: SPACING.md },
  count: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: SPACING.md },
});

export default EventsScreen;
