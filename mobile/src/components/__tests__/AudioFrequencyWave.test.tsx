import React, { act } from 'react';
import TestRenderer from 'react-test-renderer';
import { AudioFrequencyWave } from '../AudioFrequencyWave';

describe('AudioFrequencyWave', () => {
  let originalRaf: any;
  let originalCaf: any;

  beforeEach(() => {
    jest.useFakeTimers();
    originalRaf = global.requestAnimationFrame;
    originalCaf = global.cancelAnimationFrame;
    global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16) as any);
    global.cancelAnimationFrame = jest.fn((id) => clearTimeout(id));
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    global.requestAnimationFrame = originalRaf;
    global.cancelAnimationFrame = originalCaf;
  });

  it('returns null when isListening is false', async () => {
    let testRenderer: any;
    await act(async () => {
      testRenderer = TestRenderer.create(
        <AudioFrequencyWave isListening={false} />
      );
    });

    expect(testRenderer.toJSON()).toBeNull();
  });

  it('renders sleek AI frequency bars when isListening is true', async () => {
    let testRenderer: any;
    await act(async () => {
      testRenderer = TestRenderer.create(
        <AudioFrequencyWave isListening={true} barCount={14} />
      );
    });

    expect(testRenderer.toJSON()).not.toBeNull();
    const tree = testRenderer.toJSON();
    // The container should hold 14 child bar elements
    expect(tree.children.length).toBe(14);

    await act(async () => {
      testRenderer.unmount();
    });
  });

  it('animates smoothly with requestAnimationFrame', async () => {
    let testRenderer: any;
    await act(async () => {
      testRenderer = TestRenderer.create(
        <AudioFrequencyWave isListening={true} barCount={10} />
      );
    });

    // Advance animation frame timer
    await act(async () => {
      jest.advanceTimersByTime(100);
    });

    expect(testRenderer.toJSON().children.length).toBe(10);

    await act(async () => {
      testRenderer.unmount();
    });
  });
});
