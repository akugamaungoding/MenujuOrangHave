import React, { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'home_forest_sound_enabled';

/**
 * SoundToggle
 * A floating toggle button for forest ambience sound.
 * OFF by default, stores user preference in localStorage.
 * Uses Web Audio API to procedurally generate gentle forest canopy wind ambience
 * if no external audio file exists, ensuring zero broken 404s.
 *
 * @param {Object} props
 * @param {string} [props.audioSrc] - Optional path to forest audio file (e.g. /assets/audio/forest.mp3)
 * @param {string} [props.className='']
 */
export default function SoundToggle({ audioSrc, className = '' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);
  const noiseSourceRef = useRef(null);
  const audioElementRef = useRef(null);

  // Initialize preference from localStorage (defaults to false)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'true') {
        // User had enabled it previously, but browsers require user interaction
        // to start audio context, so we remain OFF until user clicks
        // but note the preference.
      }
    } catch {
      // localStorage may fail in private mode
    }
  }, []);

  // Web Audio Procedural Forest Ambience generator
  const startSynthesizedAmbience = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        setIsSupported(false);
        return false;
      }

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Create gentle 3-second noise buffer
      const bufferSize = ctx.sampleRate * 3;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;

      // Pink noise algorithm for soothing breeze sound
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.08;
      }

      // Loop noise buffer
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Warm low-pass filter (simulates thick forest canopy rustle)
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, ctx.currentTime);
      filter.Q.setValueAtTime(1.2, ctx.currentTime);

      // Master gain node with smooth fade-in
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 1.2);

      // Connect nodes
      whiteNoise.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      whiteNoise.start(0);

      noiseSourceRef.current = whiteNoise;
      gainNodeRef.current = masterGain;

      return true;
    } catch {
      setIsSupported(false);
      return false;
    }
  };

  const stopSynthesizedAmbience = () => {
    if (gainNodeRef.current && audioContextRef.current) {
      try {
        const ctx = audioContextRef.current;
        const gain = gainNodeRef.current;
        gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

        setTimeout(() => {
          if (noiseSourceRef.current) {
            try {
              noiseSourceRef.current.stop();
              noiseSourceRef.current.disconnect();
            } catch {
              // Ignore already stopped
            }
            noiseSourceRef.current = null;
          }
        }, 700);
      } catch {
        // Safe fallback
      }
    }
  };

  const toggleSound = () => {
    if (isPlaying) {
      // Turn OFF
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      stopSynthesizedAmbience();
      setIsPlaying(false);
      try {
        localStorage.setItem(STORAGE_KEY, 'false');
      } catch {
        // Ignore
      }
    } else {
      // Turn ON
      let success = false;
      if (audioSrc) {
        try {
          if (!audioElementRef.current) {
            audioElementRef.current = new Audio(audioSrc);
            audioElementRef.current.loop = true;
          }
          audioElementRef.current.play().catch(() => {
            // Audio file missing or blocked, fallback to procedural synthesis
            startSynthesizedAmbience();
          });
          success = true;
        } catch {
          success = startSynthesizedAmbience();
        }
      } else {
        success = startSynthesizedAmbience();
      }

      if (success) {
        setIsPlaying(true);
        try {
          localStorage.setItem(STORAGE_KEY, 'true');
        } catch {
          // Ignore
        }
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSynthesizedAmbience();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        try {
          audioContextRef.current.close();
        } catch {
          // Ignore
        }
      }
    };
  }, []);

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <button
        type="button"
        onClick={toggleSound}
        disabled={!isSupported}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? 'Mute forest ambience' : 'Play forest ambience'}
        className={`group relative flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-lg transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-[#D4A574]/60 ${
          isPlaying
            ? 'border-[#4A7C59] bg-[#4A7C59] text-[#FFFDF7] shadow-[0_4px_16px_rgba(74,124,89,0.4)]'
            : 'border-[#D4A574]/60 bg-[#FDF6E3] text-[#4A3E39] hover:border-[#D4A574] hover:bg-[#F5E6C8] shadow-[0_4px_12px_rgba(212,165,116,0.25)]'
        }`}
      >
        {/* Pulsing halo when sound is active */}
        {isPlaying && (
          <span
            className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#4A7C59]/30"
            aria-hidden="true"
          />
        )}

        {/* Speaker Icons */}
        {isPlaying ? (
          // Playing Icon (Speaker with sound waves)
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        ) : (
          // Muted Icon (Speaker with strike-through)
          <svg
            className="h-5 w-5 opacity-70 transition-opacity group-hover:opacity-100"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}

        {/* Tooltip on hover */}
        <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-md bg-[#2C2C2C] px-2.5 py-1 text-xs font-medium text-[#FDF6E3] opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
          {isPlaying ? 'Forest Ambience: On' : 'Forest Ambience: Off'}
        </span>
      </button>
    </div>
  );
}
