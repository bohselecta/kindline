# Kindline - Relationship Walkie-Talkie

A consent-first relationship communication app that converts raw feelings into aligned messages using AI and builds a shared rhythm of care with science-backed feedback loops.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/kindline)

## 🎵 Features

- **AI-Aligned Messaging** - Convert raw feelings into kind, clear communication
- **Mood Tracking** - Dual mood tracking with pattern insights  
- **Needs Analysis** - Self vs partner-perceived need assessment
- **Background Music** - Smooth jazzy hip hop soundtrack during onboarding
- **Simple Pairing** - Easy code-based partner connection
- **Local-First** - Privacy-focused with local data storage

## 🎯 Core Features

1. **Walkie Chat** - AI-aligned messaging with Four Horsemen detection and repair nudges
2. **Needs & Wants Analyzer** - Self vs partner-perceived need assessment with personalized scripts
3. **Moodline** - Dual mood tracking with pattern insights
4. **Rhythm Coach** - Weekly coaching cards based on communication metrics
5. **Pair Protocol** - Simple code-based pairing for two-person testing

## 🏗️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: Tailwind CSS + shadcn/ui components
- **State**: Zustand (optional) or React hooks
- **AI**: DeepSeek v3.2-exp (or Claude) for message alignment
- **Storage**: Local-first (localStorage/IndexedDB) with optional backend sync
- **Deployment**: Vercel (Edge Runtime)

## 📁 Project Structure

```
kindline/
├── app/                        # Next.js App Router
│   ├── api/                    # API routes
│   │   ├── messages/route.ts   # Message CRUD
│   │   ├── moods/route.ts      # Mood ping CRUD
│   │   ├── needs/insights/route.ts # Generate need insights
│   │   └── pair/
│   │       ├── create/route.ts # Create pair
│   │       └── join/route.ts   # Join pair
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main app component
├── lib/                        # Core utilities
│   ├── types.ts                # TypeScript definitions
│   ├── constants.ts            # Moods, needs items, prompts
│   └── utils.ts                # Helper functions
├── components/                 # React components
│   ├── PairLanding.tsx         # Landing + pairing flow
│   ├── PairCodeDisplay.tsx    # Share pair code
│   ├── Moodline.tsx            # Mood tracking timeline
│   └── NeedsAnalyzer.tsx       # Needs assessment + results
├── public/                     # Static assets
│   ├── music/                  # Background music
│   └── logo.*                  # Brand assets
└── vercel.json                 # Vercel deployment config
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm
- DeepSeek API key (or Claude/OpenAI for alignment)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/kindline.git
cd kindline
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp env.example .env.local
# Edit .env.local with your API keys
```

4. Start development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `DEEPSEEK_API_KEY`
   - `DEEPSEEK_BASE_URL`
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/kindline)

### Manual Deployment

```bash
# Build the project
npm run build

# Start production server
npm start
```

### Environment Variables

Create a `.env.local` file with:

```bash
# Required for AI features
DEEPSEEK_API_KEY=your_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com

# Optional: For production deployment
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 🔧 Configuration

### AI Provider

The alignment endpoint (`api/align/route.ts`) is configured for DeepSeek. To use Claude instead:

```typescript
// api/align/route.ts
const aiResponse = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 300,
    messages: [
      { role: 'user', content: `${ALIGNMENT_SYSTEM_PROMPT}\n\n${userPrompt}` }
    ]
  })
});
```

### Database Setup (Optional)

The API routes currently use TODO comments for database integration. To connect a real database:

**Option 1: Vercel KV (Redis)**

```bash
npm install @vercel/kv
```

```typescript
import { kv } from '@vercel/kv';

// Store pair
await kv.set(`pair:${pair_id}`, pairData);

// Store message
await kv.rpush(`messages:${pair_id}`, JSON.stringify(message));
```

**Option 2: Vercel Postgres**

```bash
npm install @vercel/postgres
```

```typescript
import { sql } from '@vercel/postgres';

// Store message
await sql`
  INSERT INTO messages (id, pair_id, sender_id, aligned_text, timestamp)
  VALUES (${id}, ${pair_id}, ${sender_id}, ${aligned_text}, ${timestamp})
`;
```

## 📊 Data Models

See `types.ts` for complete type definitions.

### Key Types:
- `Message` - Aligned messages with flags
- `MoodPing` - Mood check-ins
- `NeedAssessment` - Need questionnaire responses
- `Pair` - Partner connection data

## 🧪 Testing

### Test Alignment Endpoint

```bash
curl -X POST http://localhost:3000/api/align \
  -H "Content-Type: application/json" \
  -d '{
    "text": "You never listen to me!",
    "mood": "frustrated",
    "intensity": 4
  }'
```

Expected response includes `aligned` text and `flags` object.

### Test with Two Users

1. Open app in browser A → Start Pair → Copy code
2. Open app in browser B (incognito) → Join Pair → Enter code
3. Send messages from both sides

## 🎨 Customization

### Branding

Update constants in `constants.ts`:
- `MOODS` - Adjust mood options
- `NEED_ITEMS` - Customize need categories
- `REPAIR_SCRIPTS` - Add/edit repair templates

### Prompts

Modify AI behavior in `constants.ts`:
- `ALIGNMENT_SYSTEM_PROMPT` - Message alignment rules
- `NEED_INSIGHTS_SYSTEM_PROMPT` - Insight generation rules

## 🔐 Privacy & Security

- **Local-first**: All data stored locally by default
- **No tracking**: No analytics or third-party scripts
- **Consent-first**: Both partners must opt-in to pair
- **E2EE ready**: Architecture supports encryption layer

### Adding E2EE (Future)

```typescript
// Use SubtleCrypto for encryption
const encoder = new TextEncoder();
const data = encoder.encode(message);
const encrypted = await crypto.subtle.encrypt(
  { name: 'AES-GCM', iv: iv },
  key,
  data
);
```

## 📱 PWA Setup

To make this a Progressive Web App:

1. Add `next-pwa`:

```bash
npm install next-pwa
```

2. Update `next.config.js`:

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development'
});

module.exports = withPWA({
  // your next config
});
```

3. Add manifest and icons to `/public`

## 📚 Resources

- **Design Brief**: See `relationship_walkie_talkie_design_brief_v_1.md`
- **Gottman Method**: Four Horsemen, repair attempts, bids
- **Needs Theory**: Glasser's Choice Theory, Rosenberg's NVC

## 🤝 Contributing

This is a learning tool for MA counseling coursework. Fork and adapt for your own projects!

## 📄 License

MIT - See LICENSE file

## 🙏 Acknowledgments

Based on relationship science by:
- John & Julie Gottman (Gottman Institute)
- Marshall Rosenberg (Nonviolent Communication)
- William Glasser (Choice Theory)

---

**Note**: This is a learning prototype and educational tool. Not a substitute for therapy or professional counseling.
