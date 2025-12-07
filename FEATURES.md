# MoodMaps Features Overview

## 📱 Application Structure

```
MoodMaps App
├── 🗺️ Carte (Landing Tab)
│   ├── Interactive Map
│   │   ├── Custom light/desaturated style
│   │   ├── Google Maps provider
│   │   └── Mood-colored pins
│   ├── Filters
│   │   ├── CHILL chip (#5BC0EB)
│   │   ├── FESTIF chip (#F19938)
│   │   ├── CRÉATIF chip (#9B6BFF)
│   │   └── Reset button
│   ├── Search Bar
│   │   ├── Lieux search
│   │   └── Arrondissements search
│   ├── Geolocation
│   │   ├── Auto-update (60s)
│   │   ├── On-demand (crosshair button)
│   │   └── Paris fallback
│   └── Bottom Card
│       ├── Lieu name (Playfair Display)
│       ├── Quartier & Mood badge
│       ├── Price (€/€€/€€€)
│       ├── Description
│       ├── Hours & Status (🟢/🔴)
│       ├── Rating (⭐)
│       ├── Address
│       ├── Website link
│       ├── "S'y rendre maintenant" CTA
│       ├── Favorite button
│       └── Share button
│
├── 🧭 Explorer
│   ├── FlashList Grid (2 columns)
│   ├── Infinite Scroll (20/page)
│   ├── Proximity Sorting
│   └── Card Display
│       ├── Image placeholder
│       ├── Name & Mood chip
│       ├── Distance (km)
│       ├── Rating ⭐
│       ├── Price (Serif)
│       └── Tags
│
├── 📸 Moments
│   ├── Feed Layout
│   ├── Moment Card
│   │   ├── Image placeholder
│   │   ├── Linked lieu
│   │   ├── Optional text
│   │   └── Reactions display
│   ├── Reactions
│   │   ├── Short tap → Lieu mood
│   │   └── Long press → Palette
│   └── Report
│       ├── Content inapproprié
│       ├── Spam
│       └── Fausses informations
│
└── 👤 Profil
    ├── User Info
    │   ├── Avatar (uploadable)
    │   ├── Pseudo
    │   └── Email
    ├── Paris Coverage
    │   ├── Progress bar
    │   ├── Percentage
    │   └── Visited arrondissements
    ├── Favorites Count
    └── RGPD Controls
        ├── Geolocation toggle
        ├── Download data
        └── Delete account
```

## 🎨 Design System

### Colors
```
Moods:
  CHILL   → #5BC0EB (blue)
  FESTIF  → #F19938 (orange)
  CRÉATIF → #9B6BFF (purple)

Accents:
  Primary → #F4A261
  Dark    → #D86C20

Status:
  Open    → #4CAF50 (green)
  Closed  → #F44336 (red)
  Star    → #FFD700 (gold)

Base:
  White   → #FFFFFF
  Black   → #000000
  Grey    → #808080
```

### Typography
```
Serif (Playfair Display):
  - Titles (lieu names)
  - Price levels (€€€)
  - Coverage percentage

Sans (Inter):
  - Body text
  - Buttons
  - Labels
  - Descriptions
```

### Spacing
```
xs  → 4px
sm  → 8px
md  → 16px
lg  → 24px
xl  → 32px
xxl → 48px
```

## 🔧 Technical Features

### State Management
- **Zustand**: User state, mood filters, favorites
- **TanStack Query**: Configured for future API calls
- **React State**: Component-local state

### Navigation
- **Expo Router**: File-based routing
- **Tab Navigation**: 4 tabs with icons
- **Deep Linking**: Configured with "moodmaps://" scheme

### Performance
- **FlashList**: Virtualized lists for Explorer
- **Memoization**: Distance calculations cached
- **Lazy Loading**: Pagination for Explorer (20 items/page)
- **Font Optimization**: Async loading with SplashScreen

### Accessibility
- **Touch Targets**: Minimum 44x44 pixels
- **Contrast**: WCAG AA compliant
- **Labels**: accessibilityLabel on all buttons
- **Roles**: Proper accessibilityRole
- **States**: accessibilityState for selected items

### Security
- **Environment Variables**: .env for sensitive data
- **RGPD Compliance**: User consent, data export, deletion
- **Geolocation**: Permission-based
- **No Hardcoded Secrets**: All keys in .env.example

## 📊 Data Structure

### Lieu (Location)
```typescript
{
  id: string
  name: string
  quartier: string
  arrondissement: string
  mood: 'chill' | 'festif' | 'creatif'
  priceLevel: '€' | '€€' | '€€€'
  description: string
  horaires: string
  isOpen: boolean
  rating: number
  address: string
  website?: string
  location: { latitude, longitude }
  tags: string[]
  imageUrl?: string
}
```

### Moment (Post)
```typescript
{
  id: string
  lieuId: string
  imageUrl?: string
  text?: string
  reactions: {
    chill: number
    festif: number
    creatif: number
  }
  createdAt: string
  userId: string
}
```

### User
```typescript
{
  id: string
  email: string
  pseudo: string
  avatarUrl?: string
  visitedArrondissements: string[]
  likedLieux: string[]
  geolocConsent: boolean
}
```

## 🧪 Testing

### Unit Tests
- ✅ Distance calculations
- ✅ Color validation
- ✅ Touch target sizes
- ✅ Store logic (Zustand)

### Manual Testing Checklist
- ✅ Map loads with custom style
- ✅ Pins display correctly
- ✅ Filters work
- ✅ Search functions
- ✅ Geolocation handling
- ✅ Bottom card interaction
- ✅ Navigation deeplinks
- ✅ Explorer grid & scroll
- ✅ Moments reactions
- ✅ Profile RGPD controls

## 📦 Deployment

### Expo Go (Development)
```bash
npm start
# Scan QR code
```

### Dev Client (Native Features)
```bash
eas build --profile development
```

### Production Build
```bash
eas build --platform ios
eas build --platform android
```

## 🚀 Next Steps

### Immediate
1. Connect to real Supabase backend
2. Implement authentication
3. Add real images
4. Enable Sentry with DSN

### Short-term
1. Implement marker clustering
2. Add social auth (Google, Apple)
3. Real-time reactions
4. Push notifications

### Long-term
1. Dark mode
2. Internationalization
3. Advanced filters
4. User profiles
5. Comments system
6. Share functionality
7. Offline support
