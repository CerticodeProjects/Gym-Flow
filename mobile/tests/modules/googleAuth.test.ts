import { authenticateWithGoogleBackend } from '../../src/services/googleAuth';
import { isGoogleAuthLiveConfigured } from '../../src/config/authConfig';
import { apiClient } from '../../src/api/client';

jest.mock('../../src/api/client', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

describe('Google Authentication Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('checks if live Google configuration is boolean', () => {
    expect(typeof isGoogleAuthLiveConfigured()).toBe('boolean');
  });

  it('authenticates with backend successfully', async () => {
    const mockUser = { id: 10, name: 'Google Lifter', email: 'lifter@gmail.com', role: 'member' };
    (apiClient.post as jest.Mock).mockResolvedValueOnce({
      data: {
        token: 'mock-google-sanctum-token',
        user: mockUser,
      },
    });

    const result = await authenticateWithGoogleBackend({
      email: 'lifter@gmail.com',
      name: 'Google Lifter',
      google_id: 'google-sub-999',
    });

    expect(result.success).toBe(true);
    expect(result.token).toBe('mock-google-sanctum-token');
    expect(result.user).toEqual(mockUser);
    expect(apiClient.post).toHaveBeenCalledWith(
      '/api/v1/auth/google',
      {
        email: 'lifter@gmail.com',
        name: 'Google Lifter',
        google_id: 'google-sub-999',
      },
      expect.any(Object)
    );
  });

  it('handles backend error gracefully', async () => {
    (apiClient.post as jest.Mock).mockRejectedValueOnce({
      response: {
        data: {
          message: 'Unable to authenticate with Google. Valid email address is required.',
        },
      },
    });

    const result = await authenticateWithGoogleBackend({
      email: '',
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Unable to authenticate with Google');
  });
});
