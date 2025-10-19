# 🚀 Quick Start with Cursor

This guide shows how to integrate all Relay components into a fresh Next.js project using Cursor.

## Step 1: Create Next.js Project

```bash
npx create-next-app@latest relay-app --typescript --tailwind --app
cd relay-app
```

When prompted:
- ✅ Use TypeScript
- ✅ Use Tailwind CSS
- ✅ Use App Router
- ✅ Use src/ directory (optional)
- ✅ Customize default import alias: `@/*`

## Step 2: Install Dependencies

```bash
npm install lucide-react
```

## Step 3: File Structure Setup

Download all files from the `relay-app` folder and organize them:

```
relay-app/
├── app/
│   ├── page.tsx               # Copy from app-page-example.tsx
│   ├── layout.tsx             # (Next.js default)
│   └── api/
│       ├── align/
│       │   └── route.ts       # Message alignment
│       ├── pair/
│       │   ├── create/
│       │   │   └── route.ts   # Create pair
│       │   └── join/
│       │       └── route.ts   # Join pair
│       ├── messages/
│       │   └── route.ts       # Message CRUD
│       ├── moods/
│       │   └── route.ts       # Mood CRUD
│       └── needs/
│           └── insights/
│               └── route.ts   # Need insights
├── components/
│   ├── PairLanding.tsx
│   ├── PairCodeDisplay.tsx
│   ├── Moodline.tsx
│   └── NeedsAnalyzer.tsx
├── lib/
│   ├── types.ts
│   ├── constants.ts
│   └── utils.ts
├── public/
│   └── (icons, manifest for PWA)
├── .env.local                 # Environment variables
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## Step 4: Environment Setup

Create `.env.local`:

```bash
# DeepSeek API (for message alignment)
DEEPSEEK_API_KEY=sk-your-key-here
DEEPSEEK_BASE_URL=https://api.deepseek.com

# OR use Claude
# ANTHROPIC_API_KEY=sk-ant-your-key-here

# OR use OpenAI
# OPENAI_API_KEY=sk-your-key-here
```

## Step 5: Update Import Paths

The files use `@/` import alias. Verify your `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

Then update all imports to match your structure:
- `@/types` → `@/lib/types`
- `@/constants` → `@/lib/constants`
- `@/utils` → `@/lib/utils`
- `@/components/*` → correct path

**Pro tip in Cursor**: Use Find & Replace (Cmd/Ctrl + Shift + H) to batch update imports.

## Step 6: Copy Files via Cursor

### Method 1: Direct Copy
1. Select all text from each file in the download
2. In Cursor, create the corresponding file
3. Paste content

### Method 2: Cursor Chat Integration
1. Open Cursor Chat (Cmd/Ctrl + L)
2. Say: "Create the file structure for Relay app based on these files"
3. Attach all downloaded files
4. Cursor will create the structure automatically

### Method 3: Terminal
```bash
# From download location
cp -r relay-app/* /path/to/your/next-project/
```

## Step 7: Update page.tsx

Replace `app/page.tsx` with content from `app-page-example.tsx`.

Make sure imports match your structure:

```typescript
import PairLanding from '@/components/PairLanding';
import { getLocalUser } from '@/lib/utils';
import { LocalUserData } from '@/lib/types';
```

## Step 8: Test API Routes

Start dev server:

```bash
npm run dev
```

Test alignment endpoint:

```bash
curl -X POST http://localhost:3000/api/align \
  -H "Content-Type: application/json" \
  -d '{
    "text": "You never help with anything!",
    "mood": "frustrated",
    "intensity": 4
  }'
```

Should return:
```json
{
  "aligned": "I've noticed that I've been handling [specific tasks] alone lately, and I'm feeling overwhelmed. Could we talk about dividing responsibilities more evenly? I want us both to feel supported.",
  "flags": {
    "criticism": true,
    "defensiveness": false,
    "contempt": false,
    "stonewalling": false,
    "anger_level": 4
  },
  "suggestion": "Consider being more specific about which tasks feel unbalanced",
  "repair_tag": null
}
```

## Step 9: First Run

1. Open http://localhost:3000
2. Click "Start Your Pair"
3. Enter your name → Get 6-digit code
4. Open incognito tab → "Join a Pair" → Enter code
5. You're connected! 🎉

## Step 10: Customize with Cursor

Now you can use Cursor's AI to:

### Add features:
```
Cursor: "Add a feature to save aligned messages to localStorage"
```

### Fix bugs:
```
Cursor: "This component isn't rendering correctly when [scenario]"
```

### Modify styling:
```
Cursor: "Make the pairing screen more playful with animations"
```

### Add database:
```
Cursor: "Connect the message API to Vercel Postgres"
```

## 🎯 Next Steps

### Phase 1: Polish Core Features
- [ ] Add message persistence (localStorage or DB)
- [ ] Implement real-time updates (polling or WebSocket)
- [ ] Add loading states and error handling
- [ ] Test with actual partner communication

### Phase 2: Enhanced Features  
- [ ] Rhythm Coach with weekly insights
- [ ] Export/import conversation logs
- [ ] PWA installation prompts
- [ ] Dark mode support

### Phase 3: Production Ready
- [ ] Add authentication (optional)
- [ ] Implement E2EE for privacy
- [ ] Set up Vercel deployment
- [ ] Add analytics (privacy-first)

## 🐛 Common Issues

### Import errors
```
Cannot find module '@/types'
```
**Fix**: Update `tsconfig.json` paths or change imports to relative paths

### API route 404
```
POST /api/align 404
```
**Fix**: Ensure file is at `app/api/align/route.ts` (not `route.tsx`)

### Missing environment variables
```
DEEPSEEK_API_KEY is not defined
```
**Fix**: Create `.env.local` with your API key, restart dev server

### Tailwind not working
```
Styles not applied
```
**Fix**: Ensure `tailwind.config.ts` content paths include your files

## 💡 Cursor Pro Tips

### Use Composer for Multi-File Edits
Cmd/Ctrl + I → Attach multiple files → "Refactor these components to use Zustand for state"

### Use Chat for Quick Questions
Cmd/Ctrl + L → "How do I add a loading spinner to the alignment button?"

### Use Terminal in Cursor
Cmd/Ctrl + ` → Run commands without leaving editor

### Use Git Integration
Cursor has built-in Git → Commit often as you build features

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)
- [Vercel Deployment](https://vercel.com/docs)

## 🆘 Getting Help

If stuck:
1. Ask Cursor Chat with specific error messages
2. Check the README.md for architecture details
3. Review the design brief for feature specifications

Happy building! 🚀
