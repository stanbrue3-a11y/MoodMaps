import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, shadows, touchTarget } from '../../src/constants/theme';
import { useUserStore } from '../../src/store/userStore';

const TOTAL_ARRONDISSEMENTS = 20;

export default function ProfilScreen() {
  const { user, updateGeolocConsent } = useUserStore();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  const coveragePercentage = Math.round(
    (user.visitedArrondissements.length / TOTAL_ARRONDISSEMENTS) * 100
  );

  const handleAvatarPick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images' as any,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
      Alert.alert('Avatar mis à jour', 'Votre avatar a été modifié avec succès.');
    }
  };

  const handleDownloadData = () => {
    Alert.alert(
      'Télécharger mes données',
      'Vous recevrez un email avec toutes vos données dans les prochaines 48 heures.',
      [{ text: 'OK' }]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer mon compte',
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Compte supprimé', 'Votre compte a été supprimé avec succès.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
      </View>

      {/* Avatar Section */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={handleAvatarPick}
          accessibilityRole="button"
          accessibilityLabel="Changer l'avatar"
        >
          <View style={styles.avatar}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <MaterialCommunityIcons name="account-circle" size={100} color={colors.grey} />
            )}
          </View>
          <View style={styles.avatarEdit}>
            <MaterialCommunityIcons name="camera" size={20} color={colors.white} />
          </View>
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <View style={styles.section}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Pseudo</Text>
          <Text style={styles.value}>{user.pseudo}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>
      </View>

      {/* Paris Coverage Gauge */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Couverture de Paris</Text>
        <View style={styles.gaugeContainer}>
          <View style={styles.gaugeBackground}>
            <View style={[styles.gaugeFill, { width: `${coveragePercentage}%` }]} />
          </View>
          <Text style={styles.gaugeText}>
            {user.visitedArrondissements.length}/{TOTAL_ARRONDISSEMENTS} arrondissements visités
          </Text>
          <Text style={styles.gaugePercentage}>{coveragePercentage}%</Text>
        </View>

        <View style={styles.arrondissementsGrid}>
          {user.visitedArrondissements.map((arr, index) => (
            <View key={index} style={styles.arrondissementBadge}>
              <Text style={styles.arrondissementText}>{arr}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Favorites */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lieux favoris</Text>
        <Text style={styles.value}>{user.likedLieux.length} lieux favoris</Text>
      </View>

      {/* RGPD Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Confidentialité et données</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <MaterialCommunityIcons name="map-marker" size={24} color={colors.grey} />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Géolocalisation</Text>
              <Text style={styles.settingDescription}>Autoriser l'accès à ma position</Text>
            </View>
          </View>
          <Switch
            value={user.geolocConsent}
            onValueChange={updateGeolocConsent}
            trackColor={{ false: colors.lightGrey, true: colors.chill }}
            thumbColor={colors.white}
          />
        </View>

        <TouchableOpacity
          style={[styles.dataButton, { minHeight: touchTarget.minSize }]}
          onPress={handleDownloadData}
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="download" size={24} color={colors.accentDark} />
          <Text style={styles.dataButtonText}>Télécharger mes données</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.deleteButton, { minHeight: touchTarget.minSize }]}
          onPress={handleDeleteAccount}
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="delete" size={24} color={colors.statusClosed} />
          <Text style={styles.deleteButtonText}>Supprimer mon compte</Text>
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.aboutText}>MoodMaps v1.0.0</Text>
        <Text style={styles.aboutText}>Découvrez Paris selon votre humeur</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: spacing.xl,
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
  },
  section: {
    backgroundColor: colors.white,
    marginTop: spacing.md,
    padding: spacing.md,
    ...shadows.small,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: colors.lightGrey,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarEdit: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: colors.accent,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: colors.grey,
  },
  value: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.black,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Playfair-Bold',
    color: colors.black,
    marginBottom: spacing.md,
  },
  gaugeContainer: {
    marginBottom: spacing.md,
  },
  gaugeBackground: {
    height: 24,
    backgroundColor: colors.lightGrey,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  gaugeFill: {
    height: '100%',
    backgroundColor: colors.chill,
  },
  gaugeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.grey,
    marginBottom: spacing.xs,
  },
  gaugePercentage: {
    fontSize: 24,
    fontFamily: 'Playfair-Bold',
    color: colors.black,
  },
  arrondissementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md,
  },
  arrondissementBadge: {
    backgroundColor: colors.chill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  arrondissementText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: colors.white,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.black,
    marginBottom: spacing.xs,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.grey,
  },
  dataButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.md,
    borderWidth: 2,
    borderColor: colors.accentDark,
    borderRadius: 12,
  },
  dataButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.accentDark,
    marginLeft: spacing.sm,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.md,
    borderWidth: 2,
    borderColor: colors.statusClosed,
    borderRadius: 12,
  },
  deleteButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: colors.statusClosed,
    marginLeft: spacing.sm,
  },
  aboutText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: colors.grey,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});
