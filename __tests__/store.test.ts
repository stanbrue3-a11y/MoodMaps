import { useUserStore } from '../src/store/userStore';

describe('User store', () => {
  it('initializes with mock user', () => {
    const { user } = useUserStore.getState();
    expect(user).toBeDefined();
    expect(user?.email).toBe('user@moodmaps.fr');
  });

  it('toggles mood filter', () => {
    const { toggleMoodFilter, moodFilters } = useUserStore.getState();
    const initialChill = moodFilters.chill;

    toggleMoodFilter('chill');

    const newState = useUserStore.getState();
    expect(newState.moodFilters.chill).toBe(!initialChill);
  });

  it('resets mood filters', () => {
    const { toggleMoodFilter, resetMoodFilters } = useUserStore.getState();

    toggleMoodFilter('chill');
    toggleMoodFilter('festif');

    resetMoodFilters();

    const { moodFilters } = useUserStore.getState();
    expect(moodFilters.chill).toBe(false);
    expect(moodFilters.festif).toBe(false);
    expect(moodFilters.creatif).toBe(false);
  });

  it('toggles favorite lieu', () => {
    const { toggleFavorite, user } = useUserStore.getState();
    const initialLikedCount = user?.likedLieux.length || 0;

    toggleFavorite('new-lieu-id');

    const newState = useUserStore.getState();
    expect(newState.user?.likedLieux).toHaveLength(initialLikedCount + 1);
  });
});
