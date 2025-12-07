export type Mood = 'chill' | 'festif' | 'creatif';

export type PriceLevel = '€' | '€€' | '€€€';

export interface Location {
  latitude: number;
  longitude: number;
}

export interface Lieu {
  id: string;
  name: string;
  quartier: string;
  arrondissement: string;
  mood: Mood;
  priceLevel: PriceLevel;
  description: string;
  horaires: string;
  isOpen: boolean;
  rating: number;
  address: string;
  website?: string;
  location: Location;
  tags: string[];
  imageUrl?: string;
}

export interface Moment {
  id: string;
  lieuId: string;
  lieu?: Lieu;
  imageUrl?: string;
  text?: string;
  reactions: {
    chill: number;
    festif: number;
    creatif: number;
  };
  createdAt: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  pseudo: string;
  avatarUrl?: string;
  visitedArrondissements: string[];
  likedLieux: string[];
  geolocConsent: boolean;
}

export interface MoodFilter {
  chill: boolean;
  festif: boolean;
  creatif: boolean;
}
