import React, { useState } from 'react';
import {
  View, Image, TouchableOpacity, FlatList, Modal, Text, StyleSheet, Dimensions,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { FONT_SIZES, FONTS } from '../constants/typography';
import { SPACING, RADIUS } from '../constants/spacing';

const { width: W, height: H } = Dimensions.get('window');

const PropertyImageGallery = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!images.length) return null;

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxVisible(true);
  };

  return (
    <View>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onMomentumScrollEnd={(e) => {
          setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / W));
        }}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => openLightbox(index)}>
            <Image source={{ uri: item }} style={[styles.mainImage, { width: W }]} resizeMode="cover" />
          </TouchableOpacity>
        )}
      />
      {images.length > 1 && (
        <View style={styles.dots}>
          {images.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
          ))}
        </View>
      )}
      <View style={styles.counter}>
        <Text style={styles.counterText}>{activeIndex + 1}/{images.length}</Text>
      </View>

      {/* Lightbox */}
      <Modal visible={lightboxVisible} transparent animationType="fade" onRequestClose={() => setLightboxVisible(false)}>
        <View style={styles.lightbox}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setLightboxVisible(false)}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            initialScrollIndex={lightboxIndex}
            getItemLayout={(_, index) => ({ length: W, offset: W * index, index })}
            keyExtractor={(_, i) => String(i)}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.lightboxImage} resizeMode="contain" />
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainImage: { height: 260 },
  dots: { position: 'absolute', bottom: SPACING.sm, alignSelf: 'center', flexDirection: 'row' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)', marginHorizontal: 3 },
  dotActive: { backgroundColor: COLORS.white, width: 18 },
  counter: {
    position: 'absolute', bottom: SPACING.sm, right: SPACING.md,
    backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm, paddingVertical: 2,
  },
  counterText: { color: COLORS.white, fontSize: FONT_SIZES.xs, fontFamily: FONTS.medium },
  lightbox: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.97)', justifyContent: 'center',
  },
  closeBtn: { position: 'absolute', top: 50, right: SPACING.base, zIndex: 10, padding: SPACING.md },
  closeText: { color: COLORS.white, fontSize: 24, fontFamily: FONTS.bold },
  lightboxImage: { width: W, height: H },
});

export default PropertyImageGallery;
