import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, RADIUS, SHADOW } from '../../constants/spacing';
import CustomHeader from '../../components/CustomHeader';
import { useApp } from '../../context/AppContext';

const SettingsRow = ({ label, description, value, onToggle }) => (
  <View style={styles.row}>
    <View style={styles.rowInfo}>
      <Text style={styles.rowLabel}>{label}</Text>
      {description && <Text style={styles.rowDesc}>{description}</Text>}
    </View>
    <Switch value={value} onValueChange={onToggle} trackColor={{ true: COLORS.primary }} thumbColor={COLORS.white} />
  </View>
);

const SettingsScreen = ({ navigation }) => {
  const { logout } = useApp();
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(false);
  const [locationAccess, setLocationAccess] = useState(true);

  return (
    <SafeAreaView style={styles.safe}>
      <CustomHeader title="Settings" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.section}>Notifications</Text>
        <View style={styles.card}>
          <SettingsRow label="Push Notifications" description="Booking updates, event reminders" value={pushNotifs} onToggle={setPushNotifs} />
          <SettingsRow label="Email Alerts" description="New listings, price changes" value={emailAlerts} onToggle={setEmailAlerts} />
          <SettingsRow label="Price Drop Alerts" description="Get notified of price drops on saved properties" value={priceAlerts} onToggle={setPriceAlerts} />
        </View>
        <Text style={styles.section}>Privacy</Text>
        <View style={styles.card}>
          <SettingsRow label="Location Access" description="Used for nearby apartments" value={locationAccess} onToggle={setLocationAccess} />
        </View>
        <Text style={styles.version}>HomeQuest v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.base },
  section: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary, fontFamily: FONTS.medium, textTransform: 'uppercase', letterSpacing: 1, marginBottom: SPACING.sm, marginTop: SPACING.md, marginLeft: SPACING.sm },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, overflow: 'hidden', ...SHADOW.sm },
  row: { flexDirection: 'row', alignItems: 'center', padding: SPACING.base, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rowInfo: { flex: 1, marginRight: SPACING.md },
  rowLabel: { fontSize: FONT_SIZES.base, fontFamily: FONTS.medium, color: COLORS.text, fontWeight: '500' },
  rowDesc: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  version: { textAlign: 'center', fontSize: FONT_SIZES.sm, color: COLORS.textLight, marginTop: SPACING.xl },
});

export default SettingsScreen;
