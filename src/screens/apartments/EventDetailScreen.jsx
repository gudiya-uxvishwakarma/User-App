import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, RADIUS } from '../../constants/spacing';
import CustomHeader from '../../components/CustomHeader';
import CustomButton from '../../components/CustomButton';
import { formatDate } from '../../utils/helpers';
import { eventService } from '../../services/eventService';
import { useApp } from '../../context/AppContext';

const EventDetailScreen = ({ navigation, route }) => {
  const { event } = route.params || {};
  const { user } = useApp();
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!event) return null;

  const handleRegister = async () => {
    setLoading(true);
    try {
      await eventService.register(event.id, { userName: user?.name, phone: user?.phone });
      setRegistered(true);
      Alert.alert('Registered!', 'You have successfully registered for this event.');
    } catch (e) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Image source={{ uri: event.bannerImage }} style={styles.banner} resizeMode="cover" />
          <CustomHeader
            title=""
            onBack={() => navigation.goBack()}
            transparent
            light
            style={styles.headerOverlay}
          />
        </View>
        <View style={styles.content}>
          <View style={styles.categoryRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.category}>{event.category}</Text>
            </View>
            {!event.entryFee && <View style={styles.freeBadge}><Text style={styles.freeText}>Free Entry</Text></View>}
          </View>
          <Text style={styles.title}>{event.title}</Text>
          <View style={styles.metaCard}>
            <View style={styles.metaRow}>
              <Text style={styles.metaIcon}>📅</Text>
              <Text style={styles.metaText}>{formatDate(event.date)}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaIcon}>🕐</Text>
              <Text style={styles.metaText}>{event.startTime} – {event.endTime}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaIcon}>📍</Text>
              <Text style={styles.metaText}>{event.location}</Text>
            </View>
            {event.entryFee && (
              <View style={styles.metaRow}>
                <Text style={styles.metaIcon}>💰</Text>
                <Text style={styles.metaText}>Entry Fee: ₹{event.entryFee}</Text>
              </View>
            )}
            <View style={styles.metaRow}>
              <Text style={styles.metaIcon}>👥</Text>
              <Text style={styles.metaText}>{event.registeredCount} registered</Text>
            </View>
          </View>
          <Text style={styles.sectionTitle}>About this Event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
      {event.registrationRequired && !registered && (
        <View style={styles.footer}>
          <CustomButton title="Register for this Event" onPress={handleRegister} loading={loading} />
        </View>
      )}
      {registered && (
        <View style={styles.footer}>
          <View style={styles.registeredBox}>
            <Text style={styles.registeredText}>✓ You are registered for this event</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  banner: { width: '100%', height: 220 },
  headerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'transparent' },
  content: { padding: SPACING.base },
  categoryRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  categoryBadge: { backgroundColor: COLORS.inputBg, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.md, paddingVertical: 4 },
  category: { fontSize: FONT_SIZES.sm, color: COLORS.primary, fontFamily: FONTS.medium },
  freeBadge: { backgroundColor: '#DCFCE7', borderRadius: RADIUS.sm, paddingHorizontal: SPACING.md, paddingVertical: 4 },
  freeText: { fontSize: FONT_SIZES.sm, color: COLORS.success, fontFamily: FONTS.medium },
  title: { fontSize: FONT_SIZES.xxl, fontFamily: FONTS.bold, color: COLORS.text, fontWeight: '700', marginBottom: SPACING.md, lineHeight: 30 },
  metaCard: { backgroundColor: COLORS.background, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.lg, gap: SPACING.sm },
  metaRow: { flexDirection: 'row', alignItems: 'flex-start' },
  metaIcon: { fontSize: 18, marginRight: SPACING.sm, width: 24 },
  metaText: { flex: 1, fontSize: FONT_SIZES.base, color: COLORS.text, lineHeight: 22 },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontFamily: FONTS.bold, color: COLORS.text, fontWeight: '700', marginBottom: SPACING.sm },
  description: { fontSize: FONT_SIZES.base, color: COLORS.textSecondary, lineHeight: 24 },
  footer: { paddingHorizontal: SPACING.base, paddingVertical: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  registeredBox: { backgroundColor: '#DCFCE7', borderRadius: RADIUS.lg, padding: SPACING.md, alignItems: 'center' },
  registeredText: { fontSize: FONT_SIZES.base, color: COLORS.success, fontFamily: FONTS.bold, fontWeight: '700' },
});

export default EventDetailScreen;
