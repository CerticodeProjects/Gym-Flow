import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';

interface AudioFrequencyWaveProps {
  isListening: boolean;
  audioAnalyser?: any;
  barCount?: number;
}

// Sophisticated Apple monochromatic gray audio waveform palette
const GRAY_WAVE_PALETTE = [
  '#F2F2F7', // Bright silver gray at center
  '#E5E5EA', // Apple SystemGray6
  '#D1D1D6', // Apple SystemGray5
  '#AEAEB2', // Apple SystemGray4
  '#8E8E93', // Apple SystemGray
  '#636366', // Apple SystemGray2 at outer edges
];

function getBarColor(index: number, total: number): string {
  // Mirror colors from center outward: bright silver at center, soft muted gray at flanks
  const centerDist = Math.abs(index - (total - 1) / 2) / ((total - 1) / 2 || 1);
  const colorIndex = Math.min(
    GRAY_WAVE_PALETTE.length - 1,
    Math.floor(centerDist * (GRAY_WAVE_PALETTE.length - 1))
  );
  return GRAY_WAVE_PALETTE[colorIndex] || '#AEAEB2';
}

export const AudioFrequencyWave: React.FC<AudioFrequencyWaveProps> = ({
  isListening,
  audioAnalyser,
  barCount = 32,
}) => {
  const [bars, setBars] = useState<number[]>(() => new Array(barCount).fill(4));
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const audioDataRef = useRef<Uint8Array | null>(null);

  // Audio frequency wave animation loop
  useEffect(() => {
    if (!isListening) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setBars(new Array(barCount).fill(4));
      return;
    }

    startTimeRef.current = Date.now();

    if (audioAnalyser) {
      try {
        audioDataRef.current = new Uint8Array(audioAnalyser.frequencyBinCount);
      } catch {}
    }

    const animate = () => {
      const now = Date.now();
      const elapsed = (now - startTimeRef.current) / 1000;

      // Check audio volume if analyzer exists
      let liveVolume = 0.35;
      if (audioAnalyser && audioDataRef.current) {
        try {
          audioAnalyser.getByteFrequencyData(audioDataRef.current);
          let sum = 0;
          const len = audioDataRef.current.length;
          for (let i = 0; i < len; i++) {
            sum += audioDataRef.current[i] || 0;
          }
          liveVolume = Math.min(1.0, (sum / (len * 255)) * 3.4);
        } catch {}
      }

      // Compute dynamic wave heights
      const newHeights = [];
      const minH = 4;
      const maxH = 22;

      for (let i = 0; i < barCount; i++) {
        // Bell-curve distribution: center bars have higher peaks
        const distFromCenter = Math.abs(i - (barCount - 1) / 2) / ((barCount - 1) / 2 || 1);
        const centerMultiplier = Math.cos(distFromCenter * (Math.PI / 2.3));

        // Harmonic sine wave oscillation
        const wave1 = Math.sin(elapsed * 7.5 + i * 0.42);
        const wave2 = Math.cos(elapsed * 11.0 - i * 0.32);
        const wave3 = Math.sin(elapsed * 4.5 + i * 0.65);
        const combined = 0.5 + 0.5 * ((wave1 + wave2 + wave3) / 3);

        const currentAmp = Math.max(0.18, liveVolume * 0.72 + combined * 0.42);
        const height = Math.round(minH + currentAmp * centerMultiplier * (maxH - minH));
        newHeights.push(Math.max(minH, Math.min(maxH, height)));
      }

      setBars(newHeights);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isListening, audioAnalyser, barCount]);

  if (!isListening) return null;

  return (
    <View style={styles.container}>
      {bars.map((h, i) => (
        <View
          key={i}
          style={[
            styles.freqBar,
            {
              height: h,
              backgroundColor: getBarColor(i, barCount),
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    gap: 3.2,
    paddingHorizontal: 8,
    width: '100%',
  },
  freqBar: {
    width: 3,
    borderRadius: 1.5,
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
});
