import { calculateDistance, formatDistance } from '../src/utils/distance';

describe('Distance utilities', () => {
  it('calculates distance between two coordinates', () => {
    const from = { latitude: 48.8566, longitude: 2.3522 }; // Paris center
    const to = { latitude: 48.8606, longitude: 2.3522 }; // Slightly north

    const distance = calculateDistance(from, to);
    expect(distance).toBeGreaterThan(0);
    expect(distance).toBeLessThan(1); // Less than 1km
  });

  it('formats distance correctly for meters', () => {
    expect(formatDistance(0.5)).toBe('500m');
  });

  it('formats distance correctly for kilometers', () => {
    expect(formatDistance(2.345)).toBe('2.3km');
  });
});
