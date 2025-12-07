import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, touchTarget, shadows } from '../constants/theme';
import { Lieu } from '../types';
import { useUserStore } from '../store/userStore';

interface BottomCardProps {
  lieu: Lieu;
  onClose: () => void;
}

export default function BottomCard({ lieu, onClose }: BottomCardProps) {
  const { user, toggleFavorite } = useUserStore();
  const isFavorite = user?.likedLieux.includes(lieu.id) || false;

  const handleNavigate = () => {
    const url = Platform.select({
      ios: `maps://app?daddr=${lieu.location.latitude},${lieu.location.longitude}`,
      android: `google.navigation:q=${lieu.location.latitude},${lieu.location.longitude}`,
    });
    if (url) {
      Linking.openURL(url);
    }
  };

  const handleWebsite = () => {
    if (lieu.website) {
      Linking.openURL(lieu.website);
    }
  };

  const getMoodColor = () => {
    switch (lieu.mood) {
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

  const getMoodLabel = () => {
    switch (lieu.mood) {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>{lieu.name}</Text>
          <Text style={styles.quartier}>{lieu.quartier}</Text>
        </View>
        <TouchableOpacity
          onPress={onClose}
          style={{ width: touchTarget.minSize, height: touchTarget.minSize }}
          accessibilityRole="button"
          accessibilityLabel="Fermer"
        >
          <MaterialCommunityIcons name="close" size={24} color={colors.black} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.row}>
          <View style={[styles.moodBadge, { backgroundColor: getMoodColor() }]}>
            <Text style={styles.moodText}>{getMoodLabel()}</Text>
          </View>
          <Text style={styles.price}>{lieu.priceLevel}</Text>
        </View>

        <Text style={styles.description}>{lieu.description}</Text>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="clock-outline" size={20} color={colors.grey} />
          <Text style={styles.infoText}>{lieu.horaires}</Text>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: lieu.isOpen ? colors.statusOpen : colors.statusClosed },
            ]}
          />
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="star" size={20} color={colors.ratingStar} />
          <Text style={styles.infoText}>{lieu.rating.toFixed(1)}/5</Text>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="map-marker" size={20} color={colors.grey} />
          <Text style={styles.infoText}>
            {lieu.address} • {lieu.quartier}
          </Text>
        </View>

        {lieu.website && (
          <TouchableOpacity
            style={[styles.linkButton, { minHeight: touchTarget.minSize }]}
            onPress={handleWebsite}
          >
            <MaterialCommunityIcons name="web" size={20} color={colors.accentDark} />
            <Text style={styles.linkText}>Visiter le site web</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.ctaButton, { minHeight: touchTarget.minSize }]}
          onPress={handleNavigate}
        >
          <Text style={styles.ctaText}>S'y rendre maintenant</Text>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { width: touchTarget.minSize, height: touchTarget.minSize },
            ]}
            onPress={() => toggleFavorite(lieu.id)}
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <MaterialCommunityIcons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? colors.festif : colors.grey}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { width: touchTarget.minSize, height: touchTarget.minSize },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Partager"
          >
            <MaterialCommunityIcons name="share-variant" size={24} color={colors.grey} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    maxHeight: '70%',
    ...shadows.large,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  name: {
    fontSize: 28,
    fontFamily: 'Playfair-Bold',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  quartier: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.grey,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  moodBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    marginRight: spacing.md,
  },
  moodText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: colors.white,
  },
  price: {
    fontSize: 20,
    fontFamily: 'Playfair-Bold',
    color: colors.black,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.black,
    marginBottom: spacing.md,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.grey,
    marginLeft: spacing.sm,
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: spacing.sm,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  linkText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.accentDark,
    marginLeft: spacing.sm,
  },
  ctaButton: {
    backgroundColor: colors.accent,
    borderRadius: 24,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  ctaText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: colors.white,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: spacing.md,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
