import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../constants/spacing';
import CustomHeader from '../../components/CustomHeader';
import EmptyState from '../../components/EmptyState';

const EnquiryHistoryScreen = ({ navigation }) => (
  <SafeAreaView style={styles.safe}>
    <CustomHeader title="Enquiry History" onBack={() => navigation.goBack()} />
    <EmptyState
      icon="📋"
      title="No enquiries yet"
      message="When you enquire about a property, your history will appear here"
      actionLabel="Browse Properties"
      onAction={() => navigation.navigate('MainTabs', { screen: 'Home' })}
    />
  </SafeAreaView>
);

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: COLORS.background } });

export default EnquiryHistoryScreen;
