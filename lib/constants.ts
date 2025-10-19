import { Mood, NeedItem } from './types';

// Mood options
export const MOODS: Mood[] = [
  { emoji: '🙂', label: 'Calm', value: 'calm' },
  { emoji: '😕', label: 'Worried', value: 'worried' },
  { emoji: '😡', label: 'Frustrated', value: 'frustrated' },
  { emoji: '😢', label: 'Hurt', value: 'hurt' },
  { emoji: '😴', label: 'Tired', value: 'tired' }
];

// Mood tags
export const MOOD_TAGS = ['work', 'health', 'family', 'money', 'other'] as const;

// Needs & Wants Item Bank (14 items, 2 per category)
export const NEED_ITEMS: NeedItem[] = [
  // Security
  {
    id: 'security_1',
    category: 'security',
    question: 'I feel emotionally safe sharing vulnerable feelings'
  },
  {
    id: 'security_2',
    category: 'security',
    question: 'I trust our relationship has a stable foundation'
  },
  
  // Autonomy
  {
    id: 'autonomy_1',
    category: 'autonomy',
    question: 'I have space to make independent decisions'
  },
  {
    id: 'autonomy_2',
    category: 'autonomy',
    question: 'My individual interests and goals are respected'
  },
  
  // Belonging
  {
    id: 'belonging_1',
    category: 'belonging',
    question: 'I feel deeply understood and accepted'
  },
  {
    id: 'belonging_2',
    category: 'belonging',
    question: 'We share meaningful quality time together'
  },
  
  // Fairness
  {
    id: 'fairness_1',
    category: 'fairness',
    question: 'Household responsibilities feel fairly distributed'
  },
  {
    id: 'fairness_2',
    category: 'fairness',
    question: 'Emotional labor and planning feel balanced'
  },
  
  // Play
  {
    id: 'play_1',
    category: 'play',
    question: 'We laugh and have fun together regularly'
  },
  {
    id: 'play_2',
    category: 'play',
    question: 'There\'s room for playfulness and lightheartedness'
  },
  
  // Rest
  {
    id: 'rest_1',
    category: 'rest',
    question: 'I can fully relax and be unguarded'
  },
  {
    id: 'rest_2',
    category: 'rest',
    question: 'Our relationship feels like a place of rest, not stress'
  },
  
  // Recognition
  {
    id: 'recognition_1',
    category: 'recognition',
    question: 'My efforts and contributions are noticed'
  },
  {
    id: 'recognition_2',
    category: 'recognition',
    question: 'I feel valued for who I am, not just what I do'
  }
];

// Response scale labels
export const NEED_SCALE = [
  { value: 1, label: 'Not at all met' },
  { value: 2, label: 'Slightly met' },
  { value: 3, label: 'Moderately met' },
  { value: 4, label: 'Mostly met' },
  { value: 5, label: 'Fully met' }
];

// AI Prompts
export const ALIGNMENT_SYSTEM_PROMPT = `You are a relationship alignment translator. Rewrite the user's message to their partner so that it is clear, specific, non-blaming, brief (45–120 words), and focused on observation, feeling, need, and a concrete request. Use 'I' statements, factual language, and gentle tone. Preserve intent and key facts. Avoid therapy jargon. Include at most one curious, non-leading question if helpful. Prohibit contempt, character attacks, mind-reading, ultimatums, and score-keeping. If the user is attempting a repair, include one small appreciation or accountability statement.

Return your response as a JSON object with this exact structure:
{
  "aligned": "the rewritten message",
  "flags": {
    "criticism": true/false,
    "defensiveness": true/false,
    "contempt": true/false,
    "stonewalling": true/false,
    "anger_level": 1-5
  },
  "suggestion": "optional suggestion string or null",
  "repair_tag": "optional repair phrase or null"
}`;

export const NEED_INSIGHTS_SYSTEM_PROMPT = `You are a relationship coach specializing in needs-based communication. Given a user's need assessment data showing gaps between their needs and their partner's perceived needs, generate 3 personalized insight cards.

For each significant gap, provide:
1. A brief, empathetic description of the gap
2. A specific, actionable script using "I" statements (30-50 words)
3. A micro-experiment they can try this week (one concrete action)

Focus on the 3 largest gaps (positive or negative). Use warm, non-judgmental language. Avoid therapy jargon.

Return JSON array of insights:
[
  {
    "type": "self_unmet" | "partner_unmet" | "aligned",
    "category": "need category name",
    "gap": number,
    "script": "suggested script",
    "micro_experiment": "specific action to try"
  }
]`;

// Repair Scripts
export const REPAIR_SCRIPTS = [
  {
    id: 'timeout',
    title: 'Time-out + Return',
    script: "I'm getting flooded. I care about this and want to give it my best. Can we take 20 minutes and return at :45?"
  },
  {
    id: 'small_repair',
    title: 'Small Repair',
    script: "I snapped earlier. I'm sorry. I value your effort on this. Can we reset and try again?"
  },
  {
    id: 'appreciation',
    title: 'Appreciation',
    script: "I noticed you handled [specific thing] today. Thank you, it helped me breathe."
  },
  {
    id: 'specific_ask',
    title: 'Specific Ask',
    script: "Could we try [specific behavior] [specific time/frequency] this week?"
  },
  {
    id: 'need_offer',
    title: 'Need + Offer',
    script: "I need [specific need]. I can offer [specific thing] in return. Does that work?"
  }
];

// Category metadata
export const NEED_CATEGORIES = [
  { value: 'security', label: 'Security', description: 'Feeling safe and stable' },
  { value: 'autonomy', label: 'Autonomy', description: 'Independence and choice' },
  { value: 'belonging', label: 'Belonging', description: 'Connection and intimacy' },
  { value: 'fairness', label: 'Fairness', description: 'Equity and reciprocity' },
  { value: 'play', label: 'Play', description: 'Joy and spontaneity' },
  { value: 'rest', label: 'Rest', description: 'Recovery and ease' },
  { value: 'recognition', label: 'Recognition', description: 'Appreciation and being seen' }
];

// Four Horsemen metadata
export const HORSEMEN_INFO = {
  criticism: {
    label: 'Criticism',
    color: 'amber',
    description: 'Attacking character vs. specific behavior'
  },
  defensiveness: {
    label: 'Defensiveness',
    color: 'blue',
    description: 'Making excuses or counter-attacking'
  },
  contempt: {
    label: 'Contempt',
    color: 'red',
    description: 'Disrespect, mockery, or superiority'
  },
  stonewalling: {
    label: 'Stonewalling',
    color: 'gray',
    description: 'Withdrawing or shutting down'
  }
};
