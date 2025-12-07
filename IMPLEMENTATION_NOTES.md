# MoodMaps Implementation Notes

## Overview

This document provides implementation details for the MoodMaps Expo application scaffold.

## Architecture Decisions

### Navigation
- **Expo Router**: File-based routing for better DX and automatic deep linking
- **Tab Navigation**: 4 tabs (Carte, Explorer, Moments, Profil) with Carte as landing
- **Icons**: MaterialCommunityIcons from @expo/vector-icons for consistency

### State Management
- **Zustand**: Lightweight store for user state and mood filters
- **TanStack Query**: Configured for future API calls (currently using fixtures)
- **Local State**: React hooks for component-specific state

### Styling
- **StyleSheet API**: React Native's built-in styling for performance
- **Theme System**: Centralized colors, fonts, spacing, and shadows
- **Accessibility**: 44x44 minimum touch targets, AA contrast ratios

## Key Implementation Details

### Map Screen (Carte)

**Custom Map Style**: 
- Light, desaturated colors for better readability
- Custom water (#E3F2FD) and landscape (#F5F5F5) colors
- Reduced icon visibility to focus on pins

**Geolocation**:
- Updates every 60 seconds automatically
- On-demand refresh via crosshair button
- Paris center fallback (48.8566, 2.3522) when denied
- Respects user consent toggle in Profile

**Bottom Card**:
- Uses native modals for immersive experience
- ScrollView for long content
- Linking.openURL for website and navigation
- Platform-specific Maps deeplinks (iOS/Android)

### Explorer Screen

**Performance Optimization**:
- FlashList for efficient rendering of large lists
- Lazy loading with pagination (20 items/page)
- Distance calculation cached via useMemo
- Sorting by proximity as default

**Layout**:
- 2-column grid for visual balance
- Card-based design with shadows
- Mood chips, tags, and metadata visible

### Moments Screen

**Reaction System**:
- Short tap: React with lieu's mood color
- Long press: Show full mood palette modal
- Visual feedback with badge colors at 20% opacity
- Total reaction count displayed

**Reporting**:
- Modal with predefined reasons
- No comments system (per spec)
- Alert confirmation for user feedback

### Profile Screen

**Paris Coverage**:
- Progress bar visualization
- Percentage calculation (visited / 20 arrondissements)
- Visual badges for each visited arrondissement
- Includes liked lieu arrondissements

**RGPD Compliance**:
- Geolocation consent toggle with immediate effect
- Data download mock (48h email notification)
- Account deletion with confirmation dialog
- Clear explanatory text for each feature

## Data Structure

### Fixtures

**Lieux (8 locations)**:
- Balanced mood distribution (chill, festif, creatif)
- Realistic Paris addresses and quartiers
- Various price levels (€, €€, €€€)
- Opening hours and status

**Moments (5 posts)**:
- Linked to existing lieux
- Mix of with/without text
- Realistic reaction counts
- ISO 8601 timestamps

### Supabase Schema (Documented)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  pseudo TEXT NOT NULL,
  avatar_url TEXT,
  geoloc_consent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lieux table
CREATE TABLE lieux (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  quartier TEXT NOT NULL,
  arrondissement TEXT NOT NULL,
  mood TEXT NOT NULL CHECK (mood IN ('chill', 'festif', 'creatif')),
  price_level TEXT NOT NULL CHECK (price_level IN ('€', '€€', '€€€')),
  description TEXT,
  horaires TEXT,
  is_open BOOLEAN,
  rating DECIMAL(2,1),
  address TEXT NOT NULL,
  website TEXT,
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  tags TEXT[],
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Moments table
CREATE TABLE moments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lieu_id UUID REFERENCES lieux(id),
  user_id UUID REFERENCES users(id),
  image_url TEXT,
  text TEXT,
  reactions_chill INTEGER DEFAULT 0,
  reactions_festif INTEGER DEFAULT 0,
  reactions_creatif INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User favorites
CREATE TABLE favorites (
  user_id UUID REFERENCES users(id),
  lieu_id UUID REFERENCES lieux(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, lieu_id)
);

-- User visits
CREATE TABLE visits (
  user_id UUID REFERENCES users(id),
  arrondissement TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, arrondissement)
);
```

## Performance Considerations

### Bundle Size
- Fonts loaded asynchronously with SplashScreen
- Tree-shaking enabled via Expo
- No unused dependencies

### Runtime Performance
- FlashList for virtualized lists
- Memoized distance calculations
- Debounced search input (can be added)
- Optimized re-renders with Zustand selectors

### Memory Management
- Image picker limited to single selection
- Map markers limited by zoom level
- Pagination prevents loading all data at once

## Accessibility Features

### Touch Targets
- Minimum 44x44 pixels for all interactive elements
- Properly sized buttons and chips
- Adequate spacing between elements

### Screen Reader Support
- accessibilityRole on all interactive components
- accessibilityLabel for icon-only buttons
- accessibilityState for selected/pressed states

### Visual Accessibility
- High contrast text (AA compliant)
- Darkened accent color for better contrast
- Status indicators use both color and text
- Clear visual hierarchy

## Testing Strategy

### Unit Tests
- Utility functions (distance calculations)
- Store logic (Zustand)
- Basic validation tests

### Integration Tests (Future)
- Navigation flow
- Form submissions
- API calls with mocked responses

### E2E Tests (Future)
- Complete user journeys
- Cross-platform testing
- Performance benchmarks

## Known Limitations & Future Work

### Current Limitations
1. **Clustering**: Basic marker display, advanced clustering requires native build
2. **Images**: Using placeholder URLs (picsum.photos)
3. **Authentication**: Mocked, needs real auth implementation
4. **Offline Support**: Not implemented
5. **Push Notifications**: Not configured

### Future Enhancements
1. **Real-time Updates**: WebSocket for live reactions
2. **Advanced Filters**: Multiple mood selection, price range
3. **Social Features**: User profiles, following, comments
4. **Analytics**: Track user behavior with Sentry/Analytics
5. **Internationalization**: Multi-language support
6. **Dark Mode**: Theme switching

## Development Workflow

### Local Development
```bash
npm start              # Start Expo dev server
npm run lint           # Run ESLint
npm run format         # Run Prettier
npm test              # Run Jest tests
npx tsc --noEmit      # Type check
```

### Testing on Device
```bash
# Expo Go (recommended for development)
npm start
# Scan QR code with device

# Dev Client (for native modules)
eas build --profile development --platform ios
eas build --profile development --platform android
```

### Production Build
```bash
# Configure app.json with correct bundle IDs
# Set up app signing
eas build --platform ios
eas build --platform android
eas submit --platform ios
eas submit --platform android
```

## Environment Variables

Required for production:
- `EXPO_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API key (iOS/Android)
- `SENTRY_DSN`: Sentry DSN for error tracking (optional)

## Security Considerations

1. **Environment Variables**: Use EAS Secrets for production
2. **API Keys**: Never commit real keys to git
3. **User Data**: Follow GDPR/RGPD guidelines
4. **Geolocation**: Request permission properly
5. **Image Uploads**: Validate file types and sizes

## Deployment Checklist

- [ ] Update bundle identifiers in app.json
- [ ] Configure signing certificates
- [ ] Set up environment variables in EAS
- [ ] Enable Sentry with production DSN
- [ ] Configure Supabase production database
- [ ] Test on real devices (iOS + Android)
- [ ] Verify accessibility with screen readers
- [ ] Performance testing with production build
- [ ] Submit to App Store / Play Store
- [ ] Set up continuous deployment

## Support & Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://docs.pmnd.rs/zustand)
- [Supabase](https://supabase.com/docs)
