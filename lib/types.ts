// Core type definitions for Relay app

export type MoodType = 'calm' | 'worried' | 'frustrated' | 'hurt' | 'tired';

export type MoodEmoji = '🙂' | '😕' | '😡' | '😢' | '😴';

export interface Mood {
  emoji: MoodEmoji;
  label: string;
  value: MoodType;
}

export interface MoodPing {
  id: string;
  pair_id: string;
  user_id: string;
  mood: MoodEmoji;
  mood_value: MoodType;
  intensity: number; // 1-5
  tag?: string; // 'work' | 'health' | 'family' | 'money' | 'other'
  timestamp: string;
}

export interface FourHorsemenFlags {
  criticism: boolean;
  defensiveness: boolean;
  contempt: boolean;
  stonewalling: boolean;
  anger_level: number; // 1-5
}

export interface AlignmentResult {
  aligned: string;
  flags: FourHorsemenFlags;
  suggestion?: string | null;
  repair_tag?: string | null;
}

export interface Message {
  id: string;
  pair_id: string;
  sender_id: string;
  raw_text: string;
  aligned_text: string;
  mood: MoodType;
  intensity: number;
  flags: FourHorsemenFlags;
  suggestion?: string | null;
  repair_tag?: string | null;
  timestamp: string;
}

export interface Pair {
  pair_id: string;
  creator_id: string;
  joiner_id?: string;
  creator_name: string;
  joiner_name?: string;
  created_at: string;
  status: 'pending' | 'active';
}

export interface LocalUserData {
  user_id: string;
  user_name: string;
  pair_id?: string;
  pair_role?: 'creator' | 'joiner';
  partner_name?: string;
}

// Needs & Wants Types
export type NeedCategory = 'security' | 'autonomy' | 'belonging' | 'fairness' | 'play' | 'rest' | 'recognition';

export interface NeedItem {
  id: string;
  category: NeedCategory;
  question: string;
}

export interface NeedResponse {
  item_id: string;
  value: number; // 1-5
}

export interface NeedAssessment {
  user_id: string;
  pair_id: string;
  perspective: 'self' | 'partner_perceived';
  responses: NeedResponse[];
  completed_at: string;
}

export interface NeedScore {
  category: NeedCategory;
  score: number; // averaged 0-5
}

export interface NeedGap {
  category: NeedCategory;
  self_score: number;
  partner_perceived_score: number;
  gap: number; // positive = partner needs more, negative = you need more
}

export interface NeedInsight {
  type: 'self_unmet' | 'partner_unmet' | 'aligned';
  category: NeedCategory;
  gap: number;
  script: string;
  micro_experiment: string;
}

// Rhythm Coach Types
export interface RhythmMetrics {
  pair_id: string;
  time_period: string; // e.g., '2025-W42'
  positivity_ratio: number;
  repair_rate: number;
  bid_responsiveness: number;
  horsemen_index: number;
  best_windows: string[]; // e.g., ['late_morning', 'early_evening']
  calculated_at: string;
}

export interface CoachingCard {
  id: string;
  type: 'best_window' | 'progress' | 'watch_out' | 'encouragement';
  title: string;
  message: string;
  icon: string;
}
