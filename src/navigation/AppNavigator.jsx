import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { COLORS } from '../constants/colors';
import { FONT_SIZES, FONTS } from '../constants/typography';
import { SPACING } from '../constants/spacing';

// Auth Screens
import SplashScreen from '../screens/auth/SplashScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main Screens
import HomeScreen from '../screens/dashboard/HomeScreen';
import ApartmentListScreen from '../screens/apartments/ApartmentListScreen';
import ApartmentDetailScreen from '../screens/apartments/ApartmentDetailScreen';
import SearchScreen from '../screens/apartments/SearchScreen';
import RentScreen from '../screens/apartments/RentScreen';
import SaleScreen from '../screens/apartments/SaleScreen';
import BookingScreen from '../screens/bookings/BookingScreen';
import BookingConfirmScreen from '../screens/bookings/BookingConfirmScreen';
import MyBookingsScreen from '../screens/bookings/MyBookingsScreen';
import BookingDetailScreen from '../screens/bookings/BookingDetailScreen';
import EventsScreen from '../screens/apartments/EventsScreen';
import EventDetailScreen from '../screens/apartments/EventDetailScreen';
import WishlistScreen from '../screens/profile/WishlistScreen';
import NotificationsScreen from '../screens/profile/NotificationsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import HelpSupportScreen from '../screens/profile/HelpSupportScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import EnquiryHistoryScreen from '../screens/profile/EnquiryHistoryScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: '🏠',
  Search: '🔍',
  Bookings: '📅',
  Wishlist: '♥',
  Profile: '👤',
};

const CustomTabBar = ({ state, descriptors, navigation }) => (
  <View style={tabStyles.container}>
    {state.routes.map((route, index) => {
      const { options } = descriptors[route.key];
      const isFocused = state.index === index;
      return (
        <TouchableOpacity
          key={route.key}
          style={tabStyles.tab}
          onPress={() => navigation.navigate(route.name)}
          accessibilityRole="button"
          accessibilityState={{ selected: isFocused }}
        >
          <Text style={[tabStyles.icon, isFocused && tabStyles.iconActive]}>
            {TAB_ICONS[route.name] || '●'}
          </Text>
          <Text style={[tabStyles.label, isFocused && tabStyles.labelActive]}>
            {route.name}
          </Text>
          {isFocused && <View style={tabStyles.indicator} />}
        </TouchableOpacity>
      );
    })}
  </View>
);

const tabStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 10,
  },
  tab: { flex: 1, alignItems: 'center', paddingTop: SPACING.sm, position: 'relative' },
  icon: { fontSize: 22, color: COLORS.textLight },
  iconActive: { color: COLORS.primary },
  label: { fontSize: FONT_SIZES.xs, color: COLORS.textLight, fontFamily: FONTS.medium, marginTop: 2 },
  labelActive: { color: COLORS.primary, fontFamily: FONTS.bold, fontWeight: '700' },
  indicator: {
    position: 'absolute', top: 0, width: 20, height: 3,
    backgroundColor: COLORS.primary, borderRadius: 2,
  },
});

const MainTabs = () => (
  <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Bookings" component={MyBookingsScreen} />
    <Tab.Screen name="Wishlist" component={WishlistScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { isLoggedIn, isLoading } = useApp();

  if (isLoading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="ApartmentList" component={ApartmentListScreen} />
            <Stack.Screen name="ApartmentDetail" component={ApartmentDetailScreen} />
            <Stack.Screen name="Rent" component={RentScreen} />
            <Stack.Screen name="Sale" component={SaleScreen} />
            <Stack.Screen name="Booking" component={BookingScreen} />
            <Stack.Screen name="BookingConfirm" component={BookingConfirmScreen} />
            <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
            <Stack.Screen name="Events" component={EventsScreen} />
            <Stack.Screen name="EventDetail" component={EventDetailScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="EnquiryHistory" component={EnquiryHistoryScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
