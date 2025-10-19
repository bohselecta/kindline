// app/page.tsx
// Main app component - example integration

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, TrendingUp, Target, Settings, LogOut } from 'lucide-react';
import PairLanding from '@/components/PairLanding';
import PairCodeDisplay from '@/components/PairCodeDisplay';
import Moodline from '@/components/Moodline';
import NeedsAnalyzer from '@/components/NeedsAnalyzer';
import { getLocalUser, updateLocalUser, clearLocalUser } from '@/lib/utils';
import { LocalUserData } from '@/lib/types';

type Tab = 'chat' | 'moodline' | 'needs' | 'settings';

export default function RelayApp() {
  const [userData, setUserData] = useState<LocalUserData | null>(null);
  const [showPairCode, setShowPairCode] = useState(false);
  const [pairCode, setPairCode] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Load user data from localStorage
    const user = getLocalUser();
    setUserData(user);
    setIsLoading(false);
  }, []);

  // Stop audio only when the main chat interface loads (not during pair creation/joining)
  useEffect(() => {
    if (userData && !showPairCode && audioRef.current) {
      audioRef.current.pause();
    }
  }, [userData, showPairCode]);

  const handlePairCreated = (user: LocalUserData, code: string) => {
    setUserData(user);
    setPairCode(code);
    setShowPairCode(true);
    
    // Update local storage with pair info
    updateLocalUser({
      pair_id: code,
      pair_role: 'creator'
    });
  };

  const handlePairJoined = (user: LocalUserData) => {
    setUserData(user);
    updateLocalUser({
      pair_role: 'joiner'
    });
  };

  const handleContinueToApp = () => {
    setShowPairCode(false);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out? This will disconnect you from your pair.')) {
      clearLocalUser();
      setUserData(null);
      setShowPairCode(false);
      setPairCode('');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show pairing flow if no user or no pair
  if (!userData || !userData.pair_id) {
    if (showPairCode) {
      return (
        <PairCodeDisplay 
          pairCode={pairCode} 
          onContinue={handleContinueToApp}
        />
      );
    }
    return (
      <PairLanding
        onPairCreated={handlePairCreated}
        onPairJoined={handlePairJoined}
        audioRef={audioRef}
      />
    );
  }

  // Main app with tabs
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <img src="/graphic-mark-logo.svg" alt="Kindline" className="w-8 h-8" />
              </div>
              <div>
                <h1 className="kindline-header text-xl font-bold lowercase">kindline</h1>
                <p className="text-xs text-gray-400">
                  {userData.partner_name ? `Connected with ${userData.partner_name}` : 'Waiting for partner...'}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="logout-button flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200"
              title="Log out and return to splash page"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'chat' && (
          <div className="text-center py-12">
            <MessageCircle className="mx-auto mb-4 text-gray-400" size={48} />
            <h2 className="text-xl font-semibold text-gray-300 mb-2">Walkie Chat</h2>
            <p className="text-gray-400 mb-4">
              AI-aligned messaging coming in next version
            </p>
            <p className="text-sm text-gray-500">
              See the working prototype in relay-prototype.jsx
            </p>
          </div>
        )}

        {activeTab === 'moodline' && (
          <Moodline
            pairId={userData.pair_id}
            userId={userData.user_id}
            partnerId={userData.partner_name || 'partner'}
            userName={userData.user_name}
            partnerName={userData.partner_name || 'Partner'}
          />
        )}

        {activeTab === 'needs' && (
          <NeedsAnalyzer
            userId={userData.user_id}
            pairId={userData.pair_id}
          />
        )}

        {activeTab === 'settings' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Your Name
                </label>
                <div className="text-white">{userData.user_name}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Pair Code
                </label>
                <div className="text-2xl font-mono font-bold text-white">
                  {userData.pair_id}
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  Share this code to reconnect or connect from another device
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Role
                </label>
                <div className="text-white capitalize">{userData.pair_role}</div>
              </div>

              <div className="pt-4 border-t border-gray-700">
                <button
                  onClick={handleLogout}
                  className="logout-button w-full bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 py-2 rounded-xl font-semibold transition-all border border-gray-600 mb-3"
                >
                  Log Out
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to reset? This will clear all local data.')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                  className="w-full bg-red-900/50 hover:bg-red-800/50 text-red-300 py-2 rounded-xl font-semibold transition-all border border-red-700"
                >
                  Reset App
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-800/50 backdrop-blur-sm border-t border-gray-700 safe-area-inset-bottom">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-3 flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'chat'
                  ? 'text-rose-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <MessageCircle size={24} />
              <span className="text-xs font-medium">Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('moodline')}
              className={`py-3 flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'moodline'
                  ? 'text-rose-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <TrendingUp size={24} />
              <span className="text-xs font-medium">Mood</span>
            </button>

            <button
              onClick={() => setActiveTab('needs')}
              className={`py-3 flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'needs'
                  ? 'text-rose-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Target size={24} />
              <span className="text-xs font-medium">Needs</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`py-3 flex flex-col items-center gap-1 transition-colors ${
                activeTab === 'settings'
                  ? 'text-rose-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Settings size={24} />
              <span className="text-xs font-medium">Settings</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
