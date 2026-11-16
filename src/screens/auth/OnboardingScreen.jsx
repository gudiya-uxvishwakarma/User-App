import React, { useState, useRef } from 'react';
import {
  View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity, StatusBar,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING, RADIUS } from '../../constants/spacing';
import CustomButton from '../../components/CustomButton';

const { width: W } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    icon: '🏙️',
    title: 'Discover Premium Homes',
    description: 'Explore thousands of apartments, villas and properties across India — all in one place.',
    bg: '#EEF2FF',
  },
  {
    id: '2',
    icon: '🔍',
    title: 'Smart Search & Filters',
    description: 'Find homes by city, locality, BHK type, budget and amenities. Sort by your preference.',
    bg: '#F0FDF4',
  },
  {
    id: '3',
    icon: '📅',
    title: 'Book a Visit Instantly',
    description: 'Schedule property visits at your convenience. Track all your bookings in one place.',
    bg: '#FFF7ED',
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const listRef = useRef(null);

  const next = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1 });
      setIndex(index + 1);
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <TouchableOpacity style={styles.skip} onPress={() => navigation.replace('Login')}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / W))}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: W }]}>
            <View style={[styles.iconCircle, { backgroundColor: item.bg }]}>
              <Text style={styles.icon}>{item.icon}</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
        <CustomButton
          title={index === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          onPress={next}
          style={styles.btn}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
          <Text style={styles.loginText}>Already have an account? <Text style={styles.loginBold}>Login</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  skip: { position: 'absolute', top: 52, right: SPACING.base, zIndex: 10, padding: SPACING.sm },
  skipText: { fontSize: FONT_SIZES.base, color: COLORS.textSecondary, fontFamily: FONTS.medium },
  slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xxl, paddingTop: 80 },
  iconCircle: {
    width: 160, height: 160, borderRadius: 80,
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.xxxl,
  },
  icon: { fontSize: 72 },
  title: {
    fontSize: FONT_SIZES.xxxl, fontFamily: FONTS.bold, color: COLORS.text,
    fontWeight: '700', textAlign: 'center', marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZES.base, color: COLORS.textSecondary, fontFamily: FONTS.regular,
    textAlign: 'center', lineHeight: 24,
  },
  footer: { paddingHorizontal: SPACING.xxl, paddingBottom: 48 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: SPACING.xl },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.border, marginHorizontal: 4 },
  dotActive: { width: 24, backgroundColor: COLORS.primary },
  btn: { marginBottom: SPACING.md },
  loginLink: { alignItems: 'center' },
  loginText: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, fontFamily: FONTS.regular },
  loginBold: { color: COLORS.primary, fontFamily: FONTS.bold, fontWeight: '700' },
});

export default OnboardingScreen;
