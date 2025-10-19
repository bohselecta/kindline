# Kindline - Relationship Walkie-Talkie

A consent-first relationship communication app that converts raw feelings into aligned messages using AI and builds a shared rhythm of care with science-backed feedback loops.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env.local
   ```
   Then edit `.env.local` and add your DeepSeek API key:
   ```
   DEEPSEEK_API_KEY=sk-your-key-here
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3001](http://localhost:3001)

## 🎯 Features

- **Pairing System**: Simple 6-digit code pairing for two-person testing
- **Moodline**: Dual mood tracking with pattern insights  
- **Needs Analyzer**: Self vs partner-perceived need assessment
- **AI Message Alignment**: DeepSeek-powered message improvement (coming soon)
- **Dark Theme**: Beautiful dark UI optimized for mobile

## 🏗️ Project Structure

```
relay-app/
├── app/
│   ├── layout.tsx          # Root layout with dark theme
│   ├── page.tsx            # Main app component
│   └── api/                # API routes
│       ├── align/          # Message alignment
│       ├── pair/           # Pairing system
│       ├── messages/       # Message CRUD
│       ├── moods/          # Mood tracking
│       └── needs/          # Needs analysis
├── components/             # React components
├── lib/                    # Utilities and types
└── public/                 # Static assets
```

## 🔧 Configuration

- **Framework**: Next.js 15 (App Router)
- **UI**: Tailwind CSS with dark theme
- **Icons**: Lucide React
- **AI**: DeepSeek API for message alignment
- **Storage**: Local-first (localStorage)

## 📱 Testing

1. Open app in browser A → "Start Your Pair" → Copy 6-digit code
2. Open app in browser B (incognito) → "Join a Pair" → Enter code
3. Test mood tracking and needs analysis features

## 🎨 Customization

The app uses a dark theme by default. All styling is handled through Tailwind CSS classes. The logo is already included in the `public/` folder.

## 📚 Next Steps

- Add your DeepSeek API key to `.env.local`
- Test the pairing flow with two browser windows
- Explore the mood tracking and needs analysis features
- The AI message alignment feature is ready but needs API key setup

---

**Note**: This is a learning tool for relationship communication. Not a substitute for therapy or professional counseling.
