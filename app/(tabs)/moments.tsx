import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, shadows, touchTarget } from '../../src/constants/theme';
import { Moment, Lieu } from '../../src/types';
import momentsData from '../../src/fixtures/moments.json';
import lieuxData from '../../src/fixtures/lieux.json';

export default function MomentsScreen() {
  const [moments, setMoments] = useState<Moment[]>(momentsData as Moment[]);
  const [selectedMoment, setSelectedMoment] = useState<string | null>(null);
  const [showReactionPalette, setShowReactionPalette] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);

  const getLieuForMoment = (moment: Moment): Lieu | undefined => {
    return (lieuxData as Lieu[]).find((l) => l.id === moment.lieuId);
  };

  const handleShortPress = (momentId: string) => {
    const moment = moments.find((m) => m.id === momentId);
    if (!moment) return;

    const lieu = getLieuForMoment(moment);
    if (!lieu) return;

    // React with lieu's mood
    handleReaction(momentId, lieu.mood);
  };

  const handleLongPress = (momentId: string) => {
    setSelectedMoment(momentId);
    setShowReactionPalette(true);
  };

  const handleReaction = (momentId: string, mood: 'chill' | 'festif' | 'creatif') => {
    setMoments((prev) =>
      prev.map((m) => {
        if (m.id === momentId) {
          return {
            ...m,
            reactions: {
              ...m.reactions,
              [mood]: m.reactions[mood] + 1,
            },
          };
        }
        return m;
      })
    );
    setShowReactionPalette(false);
  };

  const handleReport = (reason: string) => {
    Alert.alert('Signalement envoyé', `Merci d'avoir signalé ce contenu pour: ${reason}`);
    setReportModalVisible(false);
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

  const renderMoment = ({ item }: { item: Moment }) => {
    const lieu = getLieuForMoment(item);
    const totalReactions = item.reactions.chill + item.reactions.festif + item.reactions.creatif;

    return (
      <View style={styles.momentCard}>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => handleShortPress(item.id)}
          onLongPress={() => handleLongPress(item.id)}
          delayLongPress={500}
        >
          <View
            style={[
              styles.imagePlaceholder,
              { backgroundColor: lieu ? getMoodColor(lieu.mood) : colors.grey },
            ]}
          >
            <MaterialCommunityIcons name="image" size={64} color={colors.white} />
          </View>
        </TouchableOpacity>

        <View style={styles.momentContent}>
          {lieu && (
            <View style={styles.lieuInfo}>
              <MaterialCommunityIcons name="map-marker" size={16} color={colors.grey} />
              <Text style={styles.lieuName}>{lieu.name}</Text>
            </View>
          )}

          {item.text && <Text style={styles.momentText}>{item.text}</Text>}

          <View style={styles.reactionsContainer}>
            <View style={styles.reactionGroup}>
              <View
                style={[styles.reactionBadge, { backgroundColor: colors.chill, opacity: 0.2 }]}
              />
              <Text style={styles.reactionCount}>{item.reactions.chill}</Text>
            </View>
            <View style={styles.reactionGroup}>
              <View
                style={[styles.reactionBadge, { backgroundColor: colors.festif, opacity: 0.2 }]}
              />
              <Text style={styles.reactionCount}>{item.reactions.festif}</Text>
            </View>
            <View style={styles.reactionGroup}>
              <View
                style={[styles.reactionBadge, { backgroundColor: colors.creatif, opacity: 0.2 }]}
              />
              <Text style={styles.reactionCount}>{item.reactions.creatif}</Text>
            </View>
            <Text style={styles.totalReactions}>{totalReactions} réactions</Text>
          </View>

          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => {
              setSelectedMoment(item.id);
              setReportModalVisible(true);
            }}
          >
            <MaterialCommunityIcons name="flag-outline" size={16} color={colors.grey} />
            <Text style={styles.reportText}>Signaler</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Moments</Text>
        <Text style={styles.subtitle}>Découvrez les moments partagés par la communauté</Text>
      </View>

      <FlatList
        data={moments}
        renderItem={renderMoment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />

      {/* Reaction Palette Modal */}
      <Modal
        visible={showReactionPalette}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReactionPalette(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowReactionPalette(false)}
        >
          <View style={styles.paletteContainer}>
            <TouchableOpacity
              style={[
                styles.paletteButton,
                { backgroundColor: colors.chill },
                { minHeight: touchTarget.minSize },
              ]}
              onPress={() => selectedMoment && handleReaction(selectedMoment, 'chill')}
            >
              <Text style={styles.paletteText}>CHILL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.paletteButton,
                { backgroundColor: colors.festif },
                { minHeight: touchTarget.minSize },
              ]}
              onPress={() => selectedMoment && handleReaction(selectedMoment, 'festif')}
            >
              <Text style={styles.paletteText}>FESTIF</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.paletteButton,
                { backgroundColor: colors.creatif },
                { minHeight: touchTarget.minSize },
              ]}
              onPress={() => selectedMoment && handleReaction(selectedMoment, 'creatif')}
            >
              <Text style={styles.paletteText}>CRÉATIF</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Report Modal */}
      <Modal
        visible={reportModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.reportModal}>
            <Text style={styles.modalTitle}>Signaler ce moment</Text>
            <TouchableOpacity
              style={[styles.reportOption, { minHeight: touchTarget.minSize }]}
              onPress={() => handleReport('Contenu inapproprié')}
            >
              <Text style={styles.reportOptionText}>Contenu inapproprié</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.reportOption, { minHeight: touchTarget.minSize }]}
              onPress={() => handleReport('Spam')}
            >
              <Text style={styles.reportOptionText}>Spam</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.reportOption, { minHeight: touchTarget.minSize }]}
              onPress={() => handleReport('Fausses informations')}
            >
              <Text style={styles.reportOptionText}>Fausses informations</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, { minHeight: touchTarget.minSize }]}
              onPress={() => setReportModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    padding: spacing.md,
  },
  momentCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.small,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  momentContent: {
    padding: spacing.md,
  },
  lieuInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  lieuName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
    marginLeft: spacing.xs,
  },
  momentText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.black,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  reactionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  reactionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  reactionBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: spacing.xs,
  },
  reactionCount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.black,
  },
  totalReactions: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: colors.grey,
    marginLeft: 'auto',
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.grey,
    marginLeft: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paletteContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.md,
    width: '80%',
  },
  paletteButton: {
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: spacing.sm,
    justifyContent: 'center',
  },
  paletteText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: colors.white,
  },
  reportModal: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Playfair-Bold',
    color: colors.black,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  reportOption: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
    justifyContent: 'center',
  },
  reportOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.black,
  },
  cancelButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.accentDark,
  },
});
