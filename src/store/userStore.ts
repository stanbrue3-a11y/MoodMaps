import { create } from 'zustand';
import { User, MoodFilter } from '../types';

interface UserState {
  user: User | null;
  moodFilters: MoodFilter;
  setUser: (user: User | null) => void;
  toggleMoodFilter: (mood: keyof MoodFilter) => void;
  resetMoodFilters: () => void;
  toggleFavorite: (lieuId: string) => void;
  addVisitedArrondissement: (arrondissement: string) => void;
  updateGeolocConsent: (consent: boolean) => void;
}

const mockUser: User = {
  id: 'user1',
  email: 'user@moodmaps.fr',
  pseudo: 'MoodExplorer',
  visitedArrondissements: ['3ème', '6ème', '10ème'],
  likedLieux: ['1', '4', '7'],
  geolocConsent: true,
};

export const useUserStore = create<UserState>((set) => ({
  user: mockUser,
  moodFilters: {
    chill: false,
    festif: false,
    creatif: false,
  },
  setUser: (user) => set({ user }),
  toggleMoodFilter: (mood) =>
    set((state) => ({
      moodFilters: {
        ...state.moodFilters,
        [mood]: !state.moodFilters[mood],
      },
    })),
  resetMoodFilters: () =>
    set({
      moodFilters: {
        chill: false,
        festif: false,
        creatif: false,
      },
    }),
  toggleFavorite: (lieuId) =>
    set((state) => {
      if (!state.user) return state;
      const likedLieux = state.user.likedLieux.includes(lieuId)
        ? state.user.likedLieux.filter((id) => id !== lieuId)
        : [...state.user.likedLieux, lieuId];
      return {
        user: {
          ...state.user,
          likedLieux,
        },
      };
    }),
  addVisitedArrondissement: (arrondissement) =>
    set((state) => {
      if (!state.user) return state;
      if (state.user.visitedArrondissements.includes(arrondissement)) return state;
      return {
        user: {
          ...state.user,
          visitedArrondissements: [...state.user.visitedArrondissements, arrondissement],
        },
      };
    }),
  updateGeolocConsent: (consent) =>
    set((state) => {
      if (!state.user) return state;
      return {
        user: {
          ...state.user,
          geolocConsent: consent,
        },
      };
    }),
}));
