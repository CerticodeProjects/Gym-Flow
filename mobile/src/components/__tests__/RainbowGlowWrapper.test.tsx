import React, { act } from 'react';
import TestRenderer from 'react-test-renderer';
import { Text } from 'react-native';
import { RainbowGlowWrapper } from '../RainbowGlowWrapper';

describe('RainbowGlowWrapper', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders children properly when inactive', async () => {
    let testRenderer: any;
    await act(async () => {
      testRenderer = TestRenderer.create(
        <RainbowGlowWrapper active={false}>
          <Text>Test Child Inactive</Text>
        </RainbowGlowWrapper>
      );
    });

    expect(testRenderer).toBeDefined();
    const textNode = testRenderer.root.findByType(Text);
    expect(textNode.props.children).toBe('Test Child Inactive');
  });

  it('renders children properly with rainbow glow when active', async () => {
    let testRenderer: any;
    await act(async () => {
      testRenderer = TestRenderer.create(
        <RainbowGlowWrapper active={true} borderRadius={24}>
          <Text>Test Child Active</Text>
        </RainbowGlowWrapper>
      );
    });

    expect(testRenderer).toBeDefined();
    const textNode = testRenderer.root.findByType(Text);
    expect(textNode.props.children).toBe('Test Child Active');

    // Clean unmount to cancel Animated loops
    await act(async () => {
      testRenderer.unmount();
    });
  });
});
