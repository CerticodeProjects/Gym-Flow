import Constants from 'expo-constants';

/**
 * Google OAuth 2.0 Configuration
 *
 * To obtain your Google Client IDs:
 * 1. Visit Google Cloud Console: https://console.cloud.google.com/apis/credentials
 * 2. Create an OAuth 2.0 Client ID:
 *    - Web Application: For Expo Web & authentication proxy
 *    - iOS: For standalone iOS builds (Bundle ID: com.gymflow.mobile)
 *    - Android: For standalone Android builds (Package: com.gymflow.mobile)
 * 3. Either paste the IDs below or set in your environment / app.json extra.
 */
export const GOOGLE_AUTH_CONFIG = {
  webClientId:
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
    Constants.expoConfig?.extra?.googleWebClientId ||
    '1080429854200-81nnap4m1c6euq5jtf6tvl3l9pqgab1j.apps.googleusercontent.com',
  iosClientId:
    process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ||
    Constants.expoConfig?.extra?.googleIosClientId ||
    '',
  androidClientId:
    process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ||
    Constants.expoConfig?.extra?.googleAndroidClientId ||
    '',
};

export const isGoogleAuthLiveConfigured = (): boolean => {
  return Boolean(
    GOOGLE_AUTH_CONFIG.webClientId ||
    GOOGLE_AUTH_CONFIG.iosClientId ||
    GOOGLE_AUTH_CONFIG.androidClientId
  );
};
