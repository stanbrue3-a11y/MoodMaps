# MoodMaps

Une application mobile pour découvrir Paris selon votre humeur.

## Description

MoodMaps vous aide à trouver les meilleurs lieux à Paris en fonction de votre humeur du moment : CHILL, FESTIF ou CRÉATIF. Explorez la carte, découvrez de nouveaux endroits, partagez vos moments et suivez votre couverture de Paris.

## Fonctionnalités

### 🗺️ Carte (Carte)

- Carte interactive avec style personnalisé light/désaturé
- Pins colorés selon les moods (CHILL #5BC0EB, FESTIF #F19938, CRÉATIF #9B6BFF)
- Filtres par mood avec chips mono-sélection + bouton Reset
- Recherche de lieux et arrondissements avec suggestions
- Géolocalisation avec mise à jour toutes les 60s
- Bouton crosshair pour demande de position à la demande
- Fallback Paris center si géolocalisation refusée
- Carte immersive en bas avec détails complets du lieu :
  - Nom (Playfair Display), quartier, mood principal
  - Prix (€, €€, €€€ en Serif)
  - Description courte
  - Horaires + statut ouvert/fermé (vert/rouge)
  - Rating X.X/5 avec étoile jaune/or
  - Adresse complète + quartier
  - Lien site web
  - CTA "S'y rendre maintenant" (deeplink Google/Apple Maps)
  - Boutons Favori et Partage

### 🧭 Explorer

- Layout masonry avec FlashList
- Scroll infini avec pagination (20 items/page)
- Tri par proximité par défaut
- Affichage : distance en km, rating, mood chip, tags, prix
- Skeletons de chargement

### 📸 Moments

- Feed de lecture avec images et lieux associés
- Texte optionnel pour chaque moment
- Réactions couleur :
  - Tap bref = mood du lieu associé
  - Tap long = palette CHILL/FESTIF/CRÉATIF
- Signalement avec liste de raisons (contenu inapproprié, spam, fausses infos)
- Pas de système de commentaires

### 👤 Profil

- Informations utilisateur : email, pseudo
- Avatar uploadable (mock)
- Jauge "Couverture de Paris" : % d'arrondissements visités/likés
- Nombre de lieux favoris
- Consentement géolocalisation (toggle)
- Boutons RGPD :
  - "Télécharger mes données" (mock)
  - "Supprimer mon compte" (mock avec confirmation)

## Technologies

- **Framework**: Expo (SDK 54) avec TypeScript
- **Navigation**: Expo Router avec tabs
- **Maps**: react-native-maps (Google provider)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Lists**: @shopify/flash-list
- **Fonts**: Playfair Display (Serif), Inter (Sans)
- **Icons**: @expo/vector-icons (MaterialCommunityIcons)

## Installation et démarrage

### Prérequis

- Node.js 18+
- npm ou yarn
- Expo Go app sur votre mobile (iOS/Android)

### Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Lancer le serveur de développement
npm start
```

## Test avec Expo Go

1. **Installer Expo Go** sur votre appareil mobile :
   - iOS : [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android : [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Lancer l'application** :

   ```bash
   npm start
   ```

3. **Scanner le QR code** :
   - iOS : Utilisez l'app Appareil photo native et scannez le QR code
   - Android : Utilisez l'app Expo Go et scannez le QR code depuis l'onglet "Scan QR Code"

4. **Navigation** :
   - L'app démarre sur l'onglet **Carte**
   - Utilisez les tabs en bas pour naviguer entre les 4 sections

## Configuration pour Dev Client

Si vous avez besoin de fonctionnalités natives (clustering avancé, clés API natives) :

```bash
# Installer EAS CLI
npm install -g eas-cli

# Configurer le projet
eas build:configure

# Créer un build de développement
eas build --profile development --platform ios
# ou
eas build --profile development --platform android
```

## Structure du projet

```
MoodMaps/
├── app/                    # Routes Expo Router
│   ├── (tabs)/            # Navigation par tabs
│   │   ├── _layout.tsx    # Configuration tabs
│   │   ├── index.tsx      # Carte (landing)
│   │   ├── explorer.tsx   # Explorer
│   │   ├── moments.tsx    # Moments
│   │   └── profil.tsx     # Profil
│   └── _layout.tsx        # Layout racine
├── src/
│   ├── components/        # Composants réutilisables
│   ├── constants/         # Thème, couleurs, styles
│   ├── fixtures/          # Données mock (JSON)
│   ├── hooks/             # Hooks personnalisés
│   ├── store/             # State Zustand
│   ├── types/             # Types TypeScript
│   └── utils/             # Fonctions utilitaires
├── assets/
│   └── fonts/             # Playfair Display + Inter
└── .env.example           # Variables d'environnement

```

## Data & State

### Données mockées

- **Lieux** : 8 lieux exemple dans `src/fixtures/lieux.json`
- **Moments** : 5 moments exemple dans `src/fixtures/moments.json`
- **Utilisateur** : User mock dans `src/store/userStore.ts`

### Supabase (structure documentée)

Le fichier `.env.example` contient la structure pour Supabase :

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

Par défaut, l'app utilise les données fixtures JSON.

## Thème et Accessibilité

- **Fonts** : Playfair Display (titres), Inter (texte)
- **Background** : #FFFFFF
- **Moods** :
  - CHILL : #5BC0EB
  - FESTIF : #F19938
  - CRÉATIF : #9B6BFF
- **Accents** : #F4A261 (principal), #E57E1F (dark)
- **Touch targets** : Minimum 44x44 pixels
- **Contraste** : AA compliance (accent orange peut être assombri si nécessaire)

## Outils de développement

```bash
# Linter
npm run lint

# Formatter
npm run format

# Tests
npm test
```

## Monitoring et Sentry

Sentry est configuré mais désactivé par défaut. Pour l'activer, ajoutez votre DSN dans `.env` :

```
SENTRY_DSN=votre-dsn-sentry
```

## Notes techniques

- **Géolocalisation** : Mise à jour automatique toutes les 60 secondes
- **Clustering** : Seuil de 5 markers, icône = mood dominant
- **Pins** : Contour blanc 2px, pictogramme blanc
- **Rating** : Étoile jaune/or (#FFD700)
- **CTA** : Fond orange #F4A261, texte blanc
- **Navigation** : Icônes monochromes, label actif noir, inactif gris

## Licence

Tous droits réservés © 2025 MoodMaps
