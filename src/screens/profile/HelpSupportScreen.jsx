import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, RADIUS, SHADOW } from '../../constants/spacing';
import CustomHeader from '../../components/CustomHeader';

const FAQS = [
  { q: 'How do I book a property visit?', a: 'Go to any apartment listing, scroll to the bottom, and tap "Book a Visit". Select your preferred date, time slot and fill in your details.' },
  { q: 'Is my visit booking confirmed automatically?', a: 'No. After you submit, the partner will review and confirm your visit. You will receive a notification once confirmed.' },
  { q: 'Can I cancel or reschedule a visit?', a: 'Yes. Go to My Bookings, open the booking and use the Cancel or Reschedule option.' },
  { q: 'How do I save properties to my wishlist?', a: 'Tap the heart icon on any apartment card or detail page to add it to your wishlist.' },
  { q: 'Is booking a visit the same as renting/buying?', a: 'No. A visit booking is only for scheduling a site visit. Actual rental or purchase is a separate process.' },
];

const HelpSupportScreen = ({ navigation }) => {
  const [openFaq, setOpenFaq] = React.useState(null);

  return (
    <SafeAreaView style={styles.safe}>
      <CustomHeader title="Help & Support" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Contact */}
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Contact Us</Text>
          <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('mailto:support@homequest.com')}>
            <Text style={styles.contactIcon}>✉️</Text>
            <Text style={styles.contactText}>support@homequest.com</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('tel:18001234567')}>
            <Text style={styles.contactIcon}>📞</Text>
            <Text style={styles.contactText}>1800-123-4567 (Toll Free)</Text>
          </TouchableOpacity>
        </View>

        {/* FAQs */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {FAQS.map((faq, i) => (
          <TouchableOpacity key={i} style={styles.faqItem} onPress={() => setOpenFaq(openFaq === i ? null : i)}>
            <View style={styles.faqHeader}>
              <Text style={styles.faqQ} numberOfLines={openFaq === i ? undefined : 2}>{faq.q}</Text>
              <Text style={styles.faqArrow}>{openFaq === i ? '▲' : '▼'}</Text>
            </View>
            {openFaq === i && <Text style={styles.faqA}>{faq.a}</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: SPACING.base },
  contactCard: { backgroundColor: COLORS.primary, borderRadius: RADIUS.xl, padding: SPACING.base, marginBottom: SPACING.xl },
  contactTitle: { fontSize: FONT_SIZES.lg, fontFamily: FONTS.bold, color: COLORS.white, fontWeight: '700', marginBottom: SPACING.md },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  contactIcon: { fontSize: 20, marginRight: SPACING.md },
  contactText: { fontSize: FONT_SIZES.base, color: 'rgba(255,255,255,0.9)' },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontFamily: FONTS.bold, color: COLORS.text, fontWeight: '700', marginBottom: SPACING.md },
  faqItem: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOW.sm },
  faqHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  faqQ: { flex: 1, fontSize: FONT_SIZES.base, fontFamily: FONTS.bold, color: COLORS.text, fontWeight: '700', marginRight: SPACING.sm },
  faqArrow: { fontSize: 14, color: COLORS.textSecondary },
  faqA: { marginTop: SPACING.md, fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, lineHeight: 22 },
});

export default HelpSupportScreen;
