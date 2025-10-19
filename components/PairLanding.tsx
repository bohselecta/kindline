// components/PairLanding.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Heart, Users, Key, ArrowRight, Loader2, Volume2, VolumeX } from 'lucide-react';
import { LocalUserData } from '@/lib/types';
import { createLocalUser, generatePairCode, isValidPairCode, isValidName } from '@/lib/utils';

interface PairLandingProps {
  onPairCreated: (userData: LocalUserData, pairCode: string) => void;
  onPairJoined: (userData: LocalUserData) => void;
  audioRef?: React.RefObject<HTMLAudioElement>;
}

export default function PairLanding({ onPairCreated, onPairJoined, audioRef }: PairLandingProps) {
  const [mode, setMode] = useState<'select' | 'create' | 'join'>('select');
  const [name, setName] = useState('');
  const [pairCode, setPairCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const localAudioRef = useRef<HTMLAudioElement>(null);
  const currentAudioRef = audioRef || localAudioRef;

  // Auto-play audio when component mounts
  useEffect(() => {
    if (currentAudioRef.current && mode === 'select') {
      // Try to play audio, but handle autoplay restrictions gracefully
      const playAudio = async () => {
        try {
          await currentAudioRef.current?.play();
          setIsPlaying(true);
          setIsMuted(false);
        } catch (error) {
          // Audio will be muted by default if autoplay fails
          setIsMuted(true);
          setIsPlaying(false);
        }
      };
      
      playAudio();
    }
  }, [mode]);

  const toggleAudio = () => {
    if (currentAudioRef.current) {
      if (isMuted) {
        currentAudioRef.current.muted = false;
        setIsMuted(false);
        // Try to play if not already playing
        if (!isPlaying) {
          currentAudioRef.current.play().then(() => {
            setIsPlaying(true);
          }).catch(() => {
            // Play failed, keep muted
          });
        }
      } else {
        currentAudioRef.current.muted = true;
        setIsMuted(true);
      }
    }
  };

  const handleCreatePair = async () => {
    if (!isValidName(name)) {
      setError('Please enter a name (2-30 characters)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userData = createLocalUser(name);
      const code = generatePairCode();
      
      // Call API to create pair
      const response = await fetch('/api/pair/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creator_id: userData.user_id,
          creator_name: userData.user_name,
          pair_code: code
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create pair');
      }

      onPairCreated(userData, code);
    } catch (err: any) {
      console.error('Create pair error:', err);
      setError(err.message || 'Failed to create pair. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinPair = async () => {
    if (!isValidName(name)) {
      setError('Please enter a name (2-30 characters)');
      return;
    }

    if (!isValidPairCode(pairCode)) {
      setError('Please enter a valid 6-digit pair code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userData = createLocalUser(name);
      
      // Call API to join pair
      const response = await fetch('/api/pair/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pair_code: pairCode,
          joiner_id: userData.user_id,
          joiner_name: userData.user_name
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join pair');
      }

      onPairJoined(userData);
    } catch (err: any) {
      console.error('Join pair error:', err);
      setError(err.message || 'Failed to join pair. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-gradient flex items-center justify-center p-4">
      {/* Audio element */}
      <audio
        ref={currentAudioRef}
        src="/music/kindline-splash-page.mp3"
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
      
      {/* Audio control button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleAudio}
          className="audio-control p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-200"
          title={isMuted ? "Click to unmute audio" : "Click to mute audio"}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-gray-300" />
          ) : (
            <Volume2 className="w-5 h-5 text-gray-300" />
          )}
        </button>
        {isMuted && (
          <div className="text-xs text-gray-400 text-center mt-1 font-light">
            click to play
          </div>
        )}
      </div>

      {mode === 'select' && (
        <div className="w-full max-w-md gradient-overlay rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img src="/hero-logo.svg" alt="Kindline" className="w-auto h-[100px]" />
            </div>
            <p className="friendly-text text-lg text-gray-700">Say what you mean, kindly.</p>
            <p className="friendly-text text-lg text-gray-700">Hear what they mean, clearly.</p>
          </div>

          {/* Action Cards */}
          <div className="space-y-4">
            <button
              onClick={() => setMode('create')}
              className="floating-cta w-full bg-white rounded-2xl p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-rose-200 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1 text-lg">Start Your Pair</h3>
                  <p className="text-sm text-gray-600 font-light leading-relaxed">Create a pair and invite your partner</p>
                </div>
                <ArrowRight className="text-gray-400" size={20} />
              </div>
            </button>

            <button
              onClick={() => setMode('join')}
              className="floating-cta w-full bg-white rounded-2xl p-6 hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-200 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Key className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1 text-lg">Join Your Partner</h3>
                  <p className="text-sm text-gray-600 font-light leading-relaxed">Enter your partner's pair code</p>
                </div>
                <ArrowRight className="text-gray-400" size={20} />
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-600 font-light leading-relaxed">
            <p>A learning tool for relationship communication</p>
            <p className="mt-1">Not a substitute for therapy</p>
          </div>
        </div>
      )}

      {mode === 'create' && (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 form-container">
          <button
            onClick={() => setMode('select')}
            className="text-gray-500 hover:text-gray-700 mb-6"
          >
            ← Back to start
          </button>

          <h2 className="friendly-heading text-2xl text-gray-900 mb-2">Start Your Pair</h2>
          <p className="text-gray-600 mb-6 font-light leading-relaxed">Enter your name to create a pair code</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-light text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What should we call you?"
                maxLength={30}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rose-400 focus:outline-none font-light"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={handleCreatePair}
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating...
                </>
              ) : (
                "Let's Start"
              )}
            </button>
          </div>
        </div>
      )}

      {mode === 'join' && (
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 form-container">
          <button
            onClick={() => setMode('select')}
            className="text-gray-500 hover:text-gray-700 mb-6"
          >
            ← Back to start
          </button>

          <h2 className="friendly-heading text-2xl text-gray-900 mb-2">Join Your Partner</h2>
          <p className="text-gray-600 mb-6 font-light leading-relaxed">Enter your partner's pair code</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-light text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What should we call you?"
                maxLength={30}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none font-light"
              />
            </div>

            <div>
              <label className="block text-sm font-light text-gray-700 mb-2">
                Pair Code
              </label>
              <input
                type="text"
                value={pairCode}
                onChange={(e) => setPairCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none text-center text-2xl font-mono tracking-widest font-light"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={handleJoinPair}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Joining...
                </>
              ) : (
                "Let's Connect"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}