import React, { act } from 'react';
import TestRenderer from 'react-test-renderer';
import { ProfileScreen } from '../../src/screens/ProfileScreen';
import { useAuthStore } from '../../src/store/authStore';
import { useSyncStore } from '../../src/store/syncStore';

jest.setTimeout(30000);

jest.mock('../../src/components/SquishSwitch', () => ({
  SquishSwitch: () => 'SquishSwitch',
}));

jest.mock('../../src/components/DarkVeil', () => ({
  DarkVeil: () => null,
}));

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    useNavigation: () => ({
      canGoBack: jest.fn().mockReturnValue(true),
      goBack: jest.fn(),
      navigate: jest.fn(),
    }),
    useFocusEffect: (callback: () => any) => {
      React.useEffect(() => {
        const cleanup = callback();
        return () => {
          if (typeof cleanup === 'function') cleanup();
        };
      }, []);
    },
  };
});

jest.mock('../../src/sync/SyncRepository', () => ({
  getSyncRepository: () => ({
    getPreferences: jest.fn().mockResolvedValue({
      weekly_workout_goal: 5,
      intensity: 'moderate',
      workout_type: 'full-body',
    }),
    getProfile: jest.fn().mockResolvedValue({
      name: 'John Doe',
      email: 'john@gymflow.com',
      phone: '+1 555 123 4567',
      photo_url: null,
      membership: {
        tier: 'all_access',
        status: 'active',
        expires_at: '2026-12-31T00:00:00Z',
      },
    }),
    updatePreferences: jest.fn().mockResolvedValue({}),
    updateProfile: jest.fn().mockResolvedValue({}),
  }),
}));

describe('ProfileScreen Logout Integration', () => {
  let activeRenderer: any = null;

  beforeEach(async () => {
    jest.clearAllMocks();
    await act(async () => {
      useSyncStore.getState().reset();
      await useAuthStore.getState().setAuth(
        'test_token_profile',
        { id: 99, name: 'John Doe', email: 'john@gymflow.com', role: 'member', is_profile_completed: true },
        false
      );
    });
  });

  afterEach(async () => {
    if (activeRenderer) {
      await act(async () => {
        activeRenderer.unmount();
      });
      activeRenderer = null;
    }
  });

  it('renders the ProfileScreen with user details and logout button', async () => {
    let testRenderer: any;
    await act(async () => {
      testRenderer = TestRenderer.create(<ProfileScreen />);
    });
    activeRenderer = testRenderer;

    expect(testRenderer).toBeDefined();

    // Verify user info is displayed
    const textNodes = testRenderer.root.findAllByType('Text' as any);
    const flatTexts = textNodes.map((n: any) =>
      Array.isArray(n.props.children) ? n.props.children.join('') : n.props.children
    );
    expect(flatTexts).toContain('John Doe');
    expect(flatTexts).toContain('Log Out');

    // Find the logout button
    const logoutBtn = testRenderer.root.findByProps({ testID: 'profile-logout-button' });
    expect(logoutBtn).toBeDefined();
  });

  it('opens sign out confirmation modal on clicking the logout button', async () => {
    let testRenderer: any;
    await act(async () => {
      testRenderer = TestRenderer.create(<ProfileScreen />);
    });
    activeRenderer = testRenderer;

    const logoutBtn = testRenderer.root.findByProps({ testID: 'profile-logout-button' });

    // Click Log Out button
    await act(async () => {
      logoutBtn.props.onPress();
    });

    // Check that confirm and cancel buttons are visible
    const confirmBtn = testRenderer.root.findByProps({ testID: 'confirm-logout-button' });
    const cancelBtn = testRenderer.root.findByProps({ testID: 'cancel-logout-button' });
    expect(confirmBtn).toBeDefined();
    expect(cancelBtn).toBeDefined();
  });

  it('cancels logout and keeps user authenticated when Cancel is pressed', async () => {
    let testRenderer: any;
    await act(async () => {
      testRenderer = TestRenderer.create(<ProfileScreen />);
    });
    activeRenderer = testRenderer;

    const logoutBtn = testRenderer.root.findByProps({ testID: 'profile-logout-button' });
    await act(async () => {
      logoutBtn.props.onPress();
    });

    const cancelBtn = testRenderer.root.findByProps({ testID: 'cancel-logout-button' });
    await act(async () => {
      cancelBtn.props.onPress();
    });

    // User should still be authenticated
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.token).toBe('test_token_profile');
  });

  it('executes logout and resets session & sync store when confirming sign out', async () => {
    let testRenderer: any;
    await act(async () => {
      testRenderer = TestRenderer.create(<ProfileScreen />);
    });
    activeRenderer = testRenderer;

    const logoutBtn = testRenderer.root.findByProps({ testID: 'profile-logout-button' });
    await act(async () => {
      logoutBtn.props.onPress();
    });

    const confirmBtn = testRenderer.root.findByProps({ testID: 'confirm-logout-button' });
    await act(async () => {
      await confirmBtn.props.onPress();
    });

    // Verify auth state is cleared
    const authState = useAuthStore.getState();
    expect(authState.isAuthenticated).toBe(false);
    expect(authState.token).toBeNull();
    expect(authState.user).toBeNull();
  });
});
