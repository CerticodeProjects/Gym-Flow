import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GOOGLE_AUTH_CONFIG, isGoogleAuthLiveConfigured } from '../config/authConfig';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/authStore';
import type { User } from '../types';

// Ensure any in-progress auth session is completed
WebBrowser.maybeCompleteAuthSession();

export interface GoogleAuthResponsePayload {
  token: string;
  user: User;
}

export interface GoogleBackendAuthResult {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

/**
 * Exchange Google credentials / profile with GymFlow backend
 */
export async function authenticateWithGoogleBackend(payload: {
  id_token?: string;
  access_token?: string;
  email?: string;
  name?: string;
  photo_url?: string;
  google_id?: string;
}): Promise<GoogleBackendAuthResult> {
  try {
    const res = await apiClient.post<GoogleAuthResponsePayload>(
      '/api/v1/auth/google',
      payload,
      { timeout: 8000 }
    );

    const { token, user } = res.data;
    return {
      success: true,
      token,
      user,
    };
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      'Failed to authenticate with GymFlow server.';
    return {
      success: false,
      error: msg,
    };
  }
}

/**
 * Fetch profile data directly from Google using an access token
 */
export async function fetchGoogleUserProfile(accessToken: string): Promise<{
  id?: string;
  email?: string;
  name?: string;
  picture?: string;
} | null> {
  try {
    const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}
