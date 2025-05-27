
import React, { useEffect, useRef } from 'react';

interface SoundManagerProps {
  gameState: 'waiting' | 'flying' | 'crashed';
  multiplier: number;
}

const SoundManager: React.FC<SoundManagerProps> = ({ gameState, multiplier }) => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize Web Audio API for sound simulation
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  const playSound = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration);
  };

  useEffect(() => {
    if (gameState === 'flying' && multiplier > 1) {
      // Rising sound effect
      const pitch = 200 + (multiplier - 1) * 50;
      playSound(pitch, 0.1, 'square');
    } else if (gameState === 'crashed') {
      // Crash sound effect
      playSound(150, 0.5, 'sawtooth');
    }
  }, [gameState, Math.floor(multiplier * 10)]); // Trigger on significant multiplier changes

  return null;
};

export default SoundManager;
