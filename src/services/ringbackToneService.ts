/**
 * Bangladeshi Mobile Operator Style Dual-Tone Ringback Service (টুট... টুট...)
 * 
 * ITU-T / Bangladeshi Telecommunications Standard:
 * - Frequency 1: 425 Hz
 * - Frequency 2: 480 Hz
 * - Cadence: 0.4s ON (beep), 0.6s OFF (silence) — repeats indefinitely until connected
 * - Pure Web Audio API generation without external audio files
 */

import { useEffect, useRef, useCallback } from 'react';

export interface RingbackController {
  stop: () => void;
  isPlaying: () => boolean;
}

/**
 * Generates and plays a realistic Bangladeshi mobile telecom ringback tone ("টুট...টুট...")
 * using Web Audio API dual-sine wave synthesis (425Hz + 480Hz).
 * 
 * @returns RingbackController with .stop() and .isPlaying() methods
 */
export function playBangladeshiRingback(): RingbackController {
  let isRunning = true;
  let intervalId: ReturnType<typeof setInterval> | null = null;
  let audioCtx: AudioContext | null = null;
  let masterGain: GainNode | null = null;
  let osc1: OscillatorNode | null = null;
  let osc2: OscillatorNode | null = null;

  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) {
      console.warn('Web Audio API is not supported in this browser environment.');
      return { stop: () => {}, isPlaying: () => false };
    }

    audioCtx = new AudioContextClass();

    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch((e) => console.debug('AudioContext resume deferred:', e));
    }

    // Master volume gain to prevent clipping and clicks
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    // Dual-tone frequency 1: 425 Hz
    osc1 = audioCtx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(425, audioCtx.currentTime);
    osc1.connect(masterGain);

    // Dual-tone frequency 2: 480 Hz
    osc2 = audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(480, audioCtx.currentTime);
    osc2.connect(masterGain);

    osc1.start();
    osc2.start();

    // Target volume level for phone ringback
    const TARGET_GAIN = 0.15;

    // Plays one 0.4-second dual-tone beep followed by silence
    const playSingleBeep = () => {
      if (!isRunning || !audioCtx || !masterGain || audioCtx.state === 'closed') return;

      try {
        const now = audioCtx.currentTime;
        masterGain.gain.cancelScheduledValues(now);
        // Ramp up quickly (15ms attack) to avoid speaker pop
        masterGain.gain.setValueAtTime(0, now);
        masterGain.gain.linearRampToValueAtTime(TARGET_GAIN, now + 0.015);
        // Hold through 0.385s
        masterGain.gain.setValueAtTime(TARGET_GAIN, now + 0.385);
        // Ramp down cleanly at 0.40s (15ms decay)
        masterGain.gain.linearRampToValueAtTime(0, now + 0.40);
      } catch (err) {
        console.debug('Error scheduling ringback beep:', err);
      }
    };

    // Trigger immediate first beep
    playSingleBeep();

    // Repeat every 1.0 second (0.4s sound + 0.6s silence)
    intervalId = setInterval(() => {
      if (!isRunning) {
        if (intervalId) clearInterval(intervalId);
        return;
      }
      playSingleBeep();
    }, 1000);
  } catch (err) {
    console.error('Failed to initialize Bangladeshi ringback audio:', err);
  }

  const stop = () => {
    if (!isRunning) return;
    isRunning = false;

    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }

    if (masterGain && audioCtx && audioCtx.state !== 'closed') {
      try {
        masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
        masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
      } catch (_) {}
    }

    setTimeout(() => {
      try {
        if (osc1) {
          osc1.stop();
          osc1.disconnect();
        }
        if (osc2) {
          osc2.stop();
          osc2.disconnect();
        }
        if (audioCtx && audioCtx.state !== 'closed') {
          audioCtx.close().catch(() => {});
        }
      } catch (_) {}
    }, 60);
  };

  return {
    stop,
    isPlaying: () => isRunning,
  };
}

/**
 * React hook for managing Bangladeshi mobile operator style dual-tone ringback playback.
 * Automatically cleans up on component unmount.
 */
export function useBangladeshiRingback() {
  const controllerRef = useRef<RingbackController | null>(null);

  const startRingback = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.stop();
    }
    controllerRef.current = playBangladeshiRingback();
  }, []);

  const stopRingback = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.stop();
      controllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.stop();
        controllerRef.current = null;
      }
    };
  }, []);

  return {
    startRingback,
    stopRingback,
    controllerRef,
  };
}

