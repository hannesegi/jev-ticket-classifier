# JevRoute AI — Smart Ticket Classifier & Auto-Router

AI-powered email and support ticket classification system that uses **Jev AI** for ultra-cheap intent classification and **OpenRouter** (free models) for auto-reply generation. Designed to reduce LLM token costs by 60-70%.

## Architecture

```
Incoming Ticket
    │
    ▼
┌─────────────────────┐
│     Jev AI Router    │  $0.04/1M tokens (output free)
│  ─────────────────   │
│  • Intent classify   │  Choice: billing|technical|sales|general|spam
│  • Urgency score     │  Score: 0.0 → 1.0
│  • Spam detection    │  Boolean: true/false
│  • Sentiment check   │  Choice: positive|neutral|negative|angry
└─────────┬───────────┘
          │
    ┌─────┼──────────┐
    ▼     ▼          ▼
  FAQ   Escalate   Auto-Reply
  (0$)  → Human    → OpenRouter Free
```

## Features

- **Smart Classification** — Jev AI classifies tickets by category, urgency, sentiment, and spam probability
- **Intelligent Routing** — Routes to auto-reply, human escalation, or spam filter based on classification
- **Auto-Reply Generation** — OpenRouter free models generate contextual responses
- **Cost Analytics Dashboard** — Real-time visualization of token savings and classification stats
- **Demo Mode** — Works without API keys using built-in simulation
- **Sample Data** — 10 pre-built sample tickets covering all categories

## Tech Stack

- **Frontend/Backend**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS 4
- **Classification Engine**: Jev AI (TypeSafe AI)
- **Reply Generation**: OpenRouter (free models — Qwen3-Coder, etc.)
- **State**: In-memory store (demo-ready)

## Getting Started

```bash
# Install dependencies
npm install

# Run in demo mode (no API keys needed)
npm run dev

# Open http://localhost:3000
```

## Configuration (Optional)

Copy `.env.example` to `.env.local` and add your API keys:

```bash
cp .env.example .env.local
```

| Variable | Description | Required |
|----------|-------------|----------|
| `JEV_API_KEY` | TypeSafe AI API key | No (demo mode) |
| `JEV_API_URL` | Jev API endpoint | No (default provided) |
| `OPENROUTER_API_KEY` | OpenRouter API key | No (demo mode) |
| `OPENROUTER_MODEL` | Free model ID | No (default: qwen/qwen3-coder:free) |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets` | List all tickets |
| POST | `/api/tickets` | Create ticket (with optional auto-process) |
| POST | `/api/classify` | Classify a ticket with Jev AI |
| POST | `/api/generate-reply` | Generate auto-reply with OpenRouter |
| GET | `/api/stats` | Get classification & cost analytics |

## Cost Analysis

| Approach | Cost per 1M requests | Notes |
|----------|---------------------|-------|
| Traditional (all LLM) | ~$3.00 | Every ticket hits GPT/Claude |
| JevRoute (Jev + Free LLM) | ~$0.04 | Jev classifies, LLM only when needed |
| **Savings** | **~98.7%** | Spam & escalations skip LLM entirely |

## License

MIT
