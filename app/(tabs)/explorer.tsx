import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, shadows } from '../../src/constants/theme';
import { Lieu } from '../../src/types';
import { useLocation } from '../../src/hooks/useLocation';
import { calculateDistance, formatDistance } from '../../src/utils/distance';
import lieuxData from '../../src/fixtures/lieux.json';

const ITEMS_PER_PAGE = 20;

export default function ExplorerScreen() {
  const { location } = useLocation();
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const sortedLieux = useMemo(() => {
    const lieux = (lieuxData as Lieu[]).map((lieu) => ({
      ...lieu,
      distance: calculateDistance(location, lieu.location),
    }));

    return lieux.sort((a, b) => a.distance - b.distance);
  }, [location]);

  const displayedLieux = sortedLieux.slice(0, page * ITEMS_PER_PAGE);

  const loadMore = () => {
    if (displayedLieux.length < sortedLieux.length && !isLoadingMore) {
      setIsLoadingMore(true);
      setTimeout(() => {
        setPage(page + 1);
        setIsLoadingMore(false);
      }, 500);
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'chill':
        return colors.chill;
      case 'festif':
        return colors.festif;
      case 'creatif':
        return colors.creatif;
      default:
        return colors.grey;
    }
  };

  const getMoodLabel = (mood: string) => {
    switch (mood) {
      case 'chill':
        return 'CHILL';
      case 'festif':
        return 'FESTIF';
      case 'creatif':
        return 'CRÉATIF';
      default:
        return '';
    }
  };

  const renderItem = ({ item }: { item: Lieu & { distance: number } }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        {item.imageUrl && (
          <View style={[styles.imagePlaceholder, { backgroundColor: getMoodColor(item.mood) }]}>
            <MaterialCommunityIcons name="image" size={48} color={colors.white} />
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={[styles.moodChip, { backgroundColor: getMoodColor(item.mood) }]}>
            <Text style={styles.moodChipText}>{getMoodLabel(item.mood)}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="map-marker" size={16} color={colors.grey} />
          <Text style={styles.infoText} numberOfLines={1}>
            {formatDistance(item.distance)} • {item.quartier}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="star" size={16} color={colors.ratingStar} />
          <Text style={styles.infoText}>{item.rating.toFixed(1)}/5</Text>
          <Text style={styles.price}>{item.priceLevel}</Text>
        </View>

        {item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Skeleton loader for future use
  // const renderSkeleton = () => (
  //   <View style={styles.card}>
  //     <View style={[styles.imagePlaceholder, { backgroundColor: colors.lightGrey }]} />
  //     <View style={styles.cardContent}>
  //       <View style={[styles.skeleton, { width: '80%', height: 20 }]} />
  //       <View style={[styles.skeleton, { width: '60%', height: 16, marginTop: spacing.sm }]} />
  //       <View style={[styles.skeleton, { width: '40%', height: 16, marginTop: spacing.sm }]} />
  //     </View>
  //   </View>
  // );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explorer</Text>
        <Text style={styles.subtitle}>Triés par proximité</Text>
      </View>

      <FlashList
        data={displayedLieux}
        renderItem={renderItem}
        numColumns={2}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color={colors.accent} />
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Playfair-Bold',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.grey,
  },
  listContent: {
    padding: spacing.sm,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    margin: spacing.sm,
    overflow: 'hidden',
    ...shadows.small,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  cardName: {
    fontSize: 18,
    fontFamily: 'Playfair-Bold',
    color: colors.black,
    flex: 1,
    marginRight: spacing.sm,
  },
  moodChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moodChipText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: colors.white,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.grey,
    marginLeft: spacing.xs,
    flex: 1,
  },
  price: {
    fontSize: 14,
    fontFamily: 'Playfair-Bold',
    color: colors.black,
    marginLeft: spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  tag: {
    backgroundColor: colors.lightGrey,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.grey,
  },
  skeleton: {
    backgroundColor: colors.lightGrey,
    borderRadius: 4,
  },
  footer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
});
