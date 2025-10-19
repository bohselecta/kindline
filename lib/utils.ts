import { LocalUserData, NeedResponse, NeedScore, NeedGap, NeedCategory } from './types';
import { NEED_ITEMS } from './constants';

// Local Storage Keys
const STORAGE_KEYS = {
  USER_DATA: 'relay_user_data',
  MESSAGES: 'relay_messages',
  MOODS: 'relay_moods',
  NEEDS: 'relay_needs'
} as const;

// Generate UUID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Generate 6-digit pair code
export function generatePairCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Local User Management
export function getLocalUser(): LocalUserData | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
  return data ? JSON.parse(data) : null;
}

export function setLocalUser(userData: LocalUserData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
}

export function createLocalUser(name: string): LocalUserData {
  const userData: LocalUserData = {
    user_id: generateId(),
    user_name: name
  };
  setLocalUser(userData);
  return userData;
}

export function updateLocalUser(updates: Partial<LocalUserData>): void {
  const current = getLocalUser();
  if (!current) return;
  setLocalUser({ ...current, ...updates });
}

export function clearLocalUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
}

// Needs Calculation Utilities
export function calculateNeedScores(responses: NeedResponse[]): NeedScore[] {
  const scoresByCategory: Record<NeedCategory, number[]> = {
    security: [],
    autonomy: [],
    belonging: [],
    fairness: [],
    play: [],
    rest: [],
    recognition: []
  };

  // Group responses by category
  responses.forEach(response => {
    const item = NEED_ITEMS.find(i => i.id === response.item_id);
    if (item) {
      scoresByCategory[item.category].push(response.value);
    }
  });

  // Calculate average for each category
  return Object.entries(scoresByCategory).map(([category, values]) => ({
    category: category as NeedCategory,
    score: values.length > 0 
      ? values.reduce((sum, val) => sum + val, 0) / values.length 
      : 0
  }));
}

export function calculateNeedGaps(
  selfScores: NeedScore[],
  partnerScores: NeedScore[]
): NeedGap[] {
  return selfScores.map(selfScore => {
    const partnerScore = partnerScores.find(p => p.category === selfScore.category);
    return {
      category: selfScore.category,
      self_score: selfScore.score,
      partner_perceived_score: partnerScore?.score || 0,
      gap: (partnerScore?.score || 0) - selfScore.score
    };
  });
}

export function getTopGaps(gaps: NeedGap[], count: number = 3): NeedGap[] {
  return [...gaps]
    .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap))
    .slice(0, count);
}

// Time utilities
export function getTimeWindow(date: Date): string {
  const hour = date.getHours();
  if (hour < 9) return 'early_morning';
  if (hour < 12) return 'late_morning';
  if (hour < 15) return 'early_afternoon';
  if (hour < 18) return 'late_afternoon';
  if (hour < 21) return 'early_evening';
  return 'night';
}

export function formatTimeWindow(window: string): string {
  const labels: Record<string, string> = {
    early_morning: 'Early Morning (6-9am)',
    late_morning: 'Late Morning (9am-12pm)',
    early_afternoon: 'Early Afternoon (12-3pm)',
    late_afternoon: 'Late Afternoon (3-6pm)',
    early_evening: 'Early Evening (6-9pm)',
    night: 'Night (9pm+)'
  };
  return labels[window] || window;
}

export function getWeekIdentifier(date: Date): string {
  const year = date.getFullYear();
  const week = getWeekNumber(date);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

// Date formatting
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

export function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit' 
  });
}

// Validation utilities
export function isValidPairCode(code: string): boolean {
  return /^\d{6}$/.test(code);
}

export function isValidName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 30;
}

// Four Horsemen scoring
export function calculateHorsemenIndex(messages: any[], period: number = 100): number {
  if (messages.length === 0) return 0;
  
  const recentMessages = messages.slice(-period);
  const flagCount = recentMessages.reduce((sum, msg) => {
    const flags = msg.flags;
    return sum + 
      (flags.criticism ? 1 : 0) +
      (flags.defensiveness ? 1 : 0) +
      (flags.contempt ? 1 : 0) +
      (flags.stonewalling ? 1 : 0);
  }, 0);
  
  return (flagCount / recentMessages.length) * 100;
}

// Positivity ratio calculation
export function calculatePositivityRatio(messages: any[]): number {
  if (messages.length === 0) return 0;
  
  const positive = messages.filter(m => 
    m.repair_tag || 
    m.aligned_text.toLowerCase().includes('thank') ||
    m.aligned_text.toLowerCase().includes('appreciate') ||
    m.aligned_text.toLowerCase().includes('love')
  ).length;
  
  const negative = messages.filter(m => {
    const flags = m.flags;
    return flags.criticism || flags.contempt || flags.anger_level >= 4;
  }).length;
  
  return negative === 0 ? (positive > 0 ? Infinity : 0) : positive / negative;
}

// Repair rate calculation
export function calculateRepairRate(messages: any[]): number {
  const repairMessages = messages.filter(m => m.repair_tag);
  if (repairMessages.length === 0) return 0;
  
  // Mock acknowledgment detection - in real app, would track responses
  // For now, assume 70% get acknowledged
  return 0.7;
}

// Export all utilities
export const StorageUtils = {
  getLocalUser,
  setLocalUser,
  createLocalUser,
  updateLocalUser,
  clearLocalUser
};

export const NeedsUtils = {
  calculateNeedScores,
  calculateNeedGaps,
  getTopGaps
};

export const MetricsUtils = {
  calculateHorsemenIndex,
  calculatePositivityRatio,
  calculateRepairRate
};

export const DateUtils = {
  getTimeWindow,
  formatTimeWindow,
  getWeekIdentifier,
  formatDate,
  formatTime
};

export const ValidationUtils = {
  isValidPairCode,
  isValidName
};
