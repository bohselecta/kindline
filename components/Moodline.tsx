// components/Moodline.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Plus } from 'lucide-react';
import { MoodPing, MoodEmoji, MoodType } from '@/lib/types';
import { MOODS, MOOD_TAGS } from '@/lib/constants';
import { formatDate } from '@/lib/utils';

interface MoodlineProps {
  pairId: string;
  userId: string;
  partnerId: string;
  userName: string;
  partnerName: string;
}

export default function Moodline({ 
  pairId, 
  userId, 
  partnerId, 
  userName, 
  partnerName 
}: MoodlineProps) {
  const [moods, setMoods] = useState<MoodPing[]>([]);
  const [showPingForm, setShowPingForm] = useState(false);
  const [selectedMood, setSelectedMood] = useState<typeof MOODS[0] | null>(null);
  const [intensity, setIntensity] = useState(3);
  const [tag, setTag] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Fetch moods on mount
  useEffect(() => {
    fetchMoods();
  }, [pairId]);

  const fetchMoods = async () => {
    try {
      const response = await fetch(`/api/moods?pair_id=${pairId}&days=7`);
      if (response.ok) {
        const data = await response.json();
        setMoods(data.moods || []);
      }
    } catch (error) {
      console.error('Failed to fetch moods:', error);
    }
  };

  const handleSubmitMood = async () => {
    if (!selectedMood) return;

    setLoading(true);
    try {
      const moodPing: Omit<MoodPing, 'id'> = {
        pair_id: pairId,
        user_id: userId,
        mood: selectedMood.emoji,
        mood_value: selectedMood.value,
        intensity,
        tag: tag || undefined,
        timestamp: new Date().toISOString()
      };

      const response = await fetch('/api/moods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moodPing)
      });

      if (response.ok) {
        const savedMood = await response.json();
        setMoods([...moods, savedMood]);
        
        // Reset form
        setSelectedMood(null);
        setIntensity(3);
        setTag('');
        setShowPingForm(false);
      }
    } catch (error) {
      console.error('Failed to save mood:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group moods by date
  const moodsByDate = moods.reduce((acc, mood) => {
    const date = new Date(mood.timestamp).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(mood);
    return acc;
  }, {} as Record<string, MoodPing[]>);

  // Get last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toDateString();
  });

  const userMoods = moods.filter(m => m.user_id === userId);
  const partnerMoods = moods.filter(m => m.user_id === partnerId);

  if (showPingForm) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">How are you feeling?</h3>
          <button
            onClick={() => setShowPingForm(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            Cancel
          </button>
        </div>

        {/* Mood Selection */}
        <div className="mb-4">
          <div className="flex gap-2">
            {MOODS.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood)}
                className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                  selectedMood?.value === mood.value
                    ? 'border-blue-500 bg-blue-50 scale-105'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-1">{mood.emoji}</div>
                <div className="text-xs text-gray-600">{mood.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Intensity */}
        {selectedMood && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intensity: {intensity}/5
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Mild</span>
                <span>Strong</span>
              </div>
            </div>

            {/* Tag */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's it about? (optional)
              </label>
              <div className="flex gap-2 flex-wrap">
                {MOOD_TAGS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTag(t)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      tag === t
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmitMood}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Mood Ping'}
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Moodline</h2>
          <p className="text-sm text-gray-600">Track your emotional rhythms together</p>
        </div>
        <button
          onClick={() => setShowPingForm(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Mood Ping
        </button>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Last 7 Days</h3>
        
        <div className="space-y-3">
          {last7Days.map((dateStr) => {
            const dayMoods = moodsByDate[dateStr] || [];
            const userDayMoods = dayMoods.filter(m => m.user_id === userId);
            const partnerDayMoods = dayMoods.filter(m => m.user_id === partnerId);

            return (
              <div key={dateStr} className="border-b border-gray-100 pb-3 last:border-0">
                <div className="text-xs font-medium text-gray-500 mb-2">
                  {formatDate(dateStr)}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* User */}
                  <div>
                    <div className="text-xs text-gray-600 mb-1">{userName}</div>
                    <div className="flex gap-1">
                      {userDayMoods.length > 0 ? (
                        userDayMoods.map((mood, idx) => (
                          <div
                            key={idx}
                            className="relative group"
                            title={`${mood.mood_value} (${mood.intensity}/5)${mood.tag ? ` - ${mood.tag}` : ''}`}
                          >
                            <span className="text-2xl">{mood.mood}</span>
                            {mood.intensity >= 4 && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                            )}
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-300 text-sm">No data</span>
                      )}
                    </div>
                  </div>

                  {/* Partner */}
                  <div>
                    <div className="text-xs text-gray-600 mb-1">{partnerName}</div>
                    <div className="flex gap-1">
                      {partnerDayMoods.length > 0 ? (
                        partnerDayMoods.map((mood, idx) => (
                          <div
                            key={idx}
                            className="relative group"
                            title={`${mood.mood_value} (${mood.intensity}/5)${mood.tag ? ` - ${mood.tag}` : ''}`}
                          >
                            <span className="text-2xl">{mood.mood}</span>
                            {mood.intensity >= 4 && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                            )}
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-300 text-sm">No data</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Insights */}
      {moods.length >= 5 && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-start gap-2">
            <TrendingUp className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-semibold text-blue-900 text-sm mb-1">Pattern Noticed</h4>
              <p className="text-sm text-blue-800">
                {userMoods.length > partnerMoods.length
                  ? `You're checking in more often. Nice consistency!`
                  : partnerMoods.length > userMoods.length
                  ? `${partnerName} is checking in more. Maybe match their rhythm?`
                  : `You're both staying connected. Great balance!`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
