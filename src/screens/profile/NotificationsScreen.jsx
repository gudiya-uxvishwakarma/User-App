import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, RADIUS } from '../../constants/spacing';
import CustomHeader from '../../components/CustomHeader';
import EmptyState from '../../components/EmptyState';
import { MOCK_NOTIFICATIONS } from '../../services/mockData';
import { formatDate } from '../../utils/helpers';

const TYPE_ICONS = { booking: '📅', event: '🎉', alert: '🔔' };

const NotificationsScreen = ({ navigation }) => {
  const notifications = MOCK_NOTIFICATIONS;

  return (
    <SafeAreaView style={styles.safe}>
      <CustomHeader title="Notifications" onBack={() => navigation.goBack()} />
      {notifications.length === 0 ? (
        <EmptyState icon="🔔" title="No notifications" message="You're all caught up!" />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={i => i.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={[styles.notif, !item.read && styles.unread]} activeOpacity={0.8}>
              <View style={styles.iconBox}>
                <Text style={styles.icon}>{TYPE_ICONS[item.type] || '🔔'}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.body}>{item.body}</Text>
                <Text style={styles.time}>{formatDate(item.createdAt)}</Text>
              </View>
              {!item.read && <View style={styles.dot} />}
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: SPACING.base },
  notif: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm },
  unread: { backgroundColor: '#EEF2FF' },
  iconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.inputBg, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  icon: { fontSize: 20 },
  info: { flex: 1 },
  title: { fontSize: FONT_SIZES.base, fontFamily: FONTS.bold, color: COLORS.text, fontWeight: '700', marginBottom: 2 },
  body: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, lineHeight: 20 },
  time: { fontSize: FONT_SIZES.xs, color: COLORS.textLight, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginTop: SPACING.xs },
});

export default NotificationsScreen;
