import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { SPACING } from '../../constants/spacing';
import ApartmentCard from '../../components/ApartmentCard';
import EmptyState from '../../components/EmptyState';
import { useApp } from '../../context/AppContext';

const WishlistScreen = ({ navigation }) => {
  const { wishlist } = useApp();

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>Wishlist</Text>
      {wishlist.length === 0 ? (
        <EmptyState
          icon="♡"
          title="No favourites yet"
          message="Tap the heart icon on any property to save it here"
          actionLabel="Browse Properties"
          onAction={() => navigation.navigate('Home')}
        />
      ) : (
        <FlatList
          data={wishlist}
          keyExtractor={i => i.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => <Text style={styles.count}>{wishlist.length} saved</Text>}
          renderItem={({ item }) => (
            <ApartmentCard
              apartment={item}
              onPress={() => navigation.navigate('ApartmentDetail', { apartment: item })}
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
  list: { paddingHorizontal: SPACING.base, paddingTop: SPACING.sm },
  count: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginBottom: SPACING.sm },
});

export default WishlistScreen;
