import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, touchTarget } from '../../src/constants/theme';
import { customMapStyle } from '../../src/constants/mapStyle';
import { useLocation } from '../../src/hooks/useLocation';
import { useUserStore } from '../../src/store/userStore';
import lieuxData from '../../src/fixtures/lieux.json';
import { Lieu } from '../../src/types';
import BottomCard from '../../src/components/BottomCard';
import MoodChip from '../../src/components/MoodChip';

// Clustering threshold for future implementation
// const CLUSTERING_THRESHOLD = 5;

export default function MapScreen() {
  const { location, requestOnDemandLocation } = useLocation();
  const { moodFilters, toggleMoodFilter, resetMoodFilters } = useUserStore();
  const [selectedLieu, setSelectedLieu] = useState<Lieu | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLieux = useMemo(() => {
    let filtered = lieuxData as Lieu[];

    // Apply mood filters
    const hasActiveFilter = Object.values(moodFilters).some((v) => v);
    if (hasActiveFilter) {
      filtered = filtered.filter((lieu) => moodFilters[lieu.mood]);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (lieu) =>
          lieu.name.toLowerCase().includes(query) ||
          lieu.quartier.toLowerCase().includes(query) ||
          lieu.arrondissement.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [moodFilters, searchQuery]);

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

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={customMapStyle}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {filteredLieux.map((lieu) => (
          <Marker
            key={lieu.id}
            coordinate={{
              latitude: lieu.location.latitude,
              longitude: lieu.location.longitude,
            }}
            onPress={() => setSelectedLieu(lieu)}
            pinColor={getMoodColor(lieu.mood)}
          />
        ))}
      </MapView>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons
          name="magnify"
          size={24}
          color={colors.grey}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un lieu ou arrondissement..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.grey}
        />
      </View>

      {/* Mood Chips */}
      <View style={styles.chipsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <MoodChip
            label="CHILL"
            color={colors.chill}
            active={moodFilters.chill}
            onPress={() => toggleMoodFilter('chill')}
          />
          <MoodChip
            label="FESTIF"
            color={colors.festif}
            active={moodFilters.festif}
            onPress={() => toggleMoodFilter('festif')}
          />
          <MoodChip
            label="CRÉATIF"
            color={colors.creatif}
            active={moodFilters.creatif}
            onPress={() => toggleMoodFilter('creatif')}
          />
          <TouchableOpacity
            style={[styles.resetButton, { minHeight: touchTarget.minSize }]}
            onPress={resetMoodFilters}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Geolocation Button */}
      <TouchableOpacity
        style={[styles.geoButton, { width: touchTarget.minSize, height: touchTarget.minSize }]}
        onPress={requestOnDemandLocation}
      >
        <MaterialCommunityIcons name="crosshairs-gps" size={24} color={colors.black} />
      </TouchableOpacity>

      {/* Bottom Card */}
      {selectedLieu && <BottomCard lieu={selectedLieu} onClose={() => setSelectedLieu(null)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    position: 'absolute',
    top: 50,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: colors.black,
  },
  chipsContainer: {
    position: 'absolute',
    top: 110,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
  },
  resetButton: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.grey,
    marginLeft: spacing.sm,
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: colors.black,
  },
  geoButton: {
    position: 'absolute',
    bottom: 120,
    right: spacing.md,
    backgroundColor: colors.white,
    borderRadius: touchTarget.minSize / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
