# Testing Documentation

## Overview

MoodMaps includes basic unit tests to validate core functionality. The testing infrastructure uses Jest with TypeScript support.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Test Structure

Tests are located in the `__tests__` directory:

- `basic.test.ts` - Basic unit tests for core constants and values
- `utils.test.ts` - Utility function tests (requires Expo test setup)
- `store.test.ts` - Zustand store tests (requires Expo test setup)
- `a11y.test.tsx` - Accessibility tests (requires React Native test setup)

## Current Test Coverage

The basic test suite includes:

1. **Color Validation**: Ensures mood colors match the design specification
2. **Accessibility**: Validates minimum touch target size (44x44 pixels)
3. **Core Logic**: Basic sanity checks

## Future Testing

For comprehensive testing including components and hooks, you'll need to:

1. Configure full Expo testing environment
2. Add component tests with React Native Testing Library
3. Add integration tests for navigation
4. Add E2E tests with Detox or Maestro

## Accessibility Testing

The app follows WCAG 2.1 AA guidelines:

- Minimum touch target size: 44x44 pixels
- Color contrast ratios meet AA standards
- All interactive elements have accessibility labels
- Screen reader support via React Native accessibility props

## Manual Testing Checklist

### Map Screen (Carte)
- [ ] Map loads with custom style
- [ ] Pins display with correct colors
- [ ] Mood filters work correctly
- [ ] Search functionality works
- [ ] Geolocation permission handling
- [ ] Bottom card displays lieu details
- [ ] Navigation to Maps app works
- [ ] Favorite toggle works

### Explorer Screen
- [ ] Grid layout displays correctly
- [ ] Infinite scroll loads more items
- [ ] Distance calculation is accurate
- [ ] Sorting by proximity works

### Moments Screen
- [ ] Feed displays moments with images
- [ ] Short tap reaction works
- [ ] Long press shows reaction palette
- [ ] Report functionality works

### Profil Screen
- [ ] User info displays correctly
- [ ] Avatar picker works (mock)
- [ ] Paris coverage gauge displays correctly
- [ ] Geolocation toggle works
- [ ] RGPD buttons work (mock)

## Performance Testing

Run the app in production mode to test performance:

```bash
npx expo start --no-dev --minify
```

Monitor:
- Initial load time
- Map rendering performance
- List scrolling performance (FlashList)
- Memory usage
