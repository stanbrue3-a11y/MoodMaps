import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

// Sentry is configured but disabled by default
// Add your DSN in .env to enable it: SENTRY_DSN=your-sentry-dsn

const sentryDsn = Constants.expoConfig?.extra?.sentryDsn || process.env.SENTRY_DSN;

export function initSentry() {
  if (sentryDsn) {
    Sentry.init({
      dsn: sentryDsn,
      debug: __DEV__,
      tracesSampleRate: 1.0,
    });
    console.log('Sentry initialized');
  } else {
    console.log('Sentry not initialized (no DSN provided)');
  }
}
