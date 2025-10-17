# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based web application built with Vite for a treehouse/garden concept design consultation flow. The app guides users through an interactive journey: landing page → chat interface → concept reveal → call-to-action (booking consultation, requesting brochure, or video chat).

## Development Commands

### Start Development Server
```bash
npm run dev
```
Development server runs on `http://[::]:8080`

### Build
```bash
npm run build          # Production build
npm run build:dev      # Development build
```

### Lint
```bash
npm run lint
```

### Preview Production Build
```bash
npm run preview
```

## Tech Stack

- **Framework**: React 18.3 + TypeScript
- **Build Tool**: Vite 5.4 with SWC for fast compilation
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Routing**: React Router DOM v6
- **State Management**: React Query (TanStack Query)
- **Backend**: Supabase (configured but minimal integration)
- **Form Handling**: React Hook Form + Zod validation

## Project Architecture

### Application Flow
The app uses a state machine pattern in `src/pages/Index.tsx` with four stages:
1. `landing` - Initial landing page
2. `chat` - Interactive chat interface for collecting user wishes
3. `concept` - Reveal generated concept with call-to-action options
4. `complete` - Thank you page

### Directory Structure
```
src/
├── components/         # Feature components
│   ├── Landing.tsx           # Landing page component
│   ├── ChatInterface.tsx     # Chat UI with message handling
│   ├── ConceptReveal.tsx     # Concept presentation & CTAs
│   └── ui/                   # shadcn/ui components (50+ components)
├── pages/             # Route components
│   ├── Index.tsx            # Main app orchestrator (stage management)
│   └── NotFound.tsx         # 404 page
├── hooks/             # Custom React hooks
│   ├── use-toast.ts         # Toast notifications
│   └── use-mobile.tsx       # Mobile detection
├── integrations/      # External service integrations
│   └── supabase/            # Supabase client & types
├── lib/               # Utilities
└── assets/            # Static assets
```

### Key Components

**Index.tsx** (`src/pages/Index.tsx`)
- Central orchestrator managing application stage transitions
- Handles concept generation, booking, brochure requests, and video chat
- Uses toast notifications for user feedback
- Placeholder integrations noted for Motion (booking), Qwilr (brochures), and WhatsApp Business

**ChatInterface.tsx** (`src/components/ChatInterface.tsx`)
- Chat UI with system/user/assistant message types
- Supports text input and voice note recording (UI only, not functional)
- Auto-scrolls to latest message
- Currently uses simulated AI responses (3s timeout)

**ConceptReveal.tsx** (`src/components/ConceptReveal.tsx`)
- Displays generated concept with elegant presentation
- Three CTA options: book consultation, request brochure, start video chat

### Styling & Design System

**Custom Colors** (defined in `tailwind.config.ts` and CSS variables):
- `forest-green` - Primary brand color
- `fresh-green` - Accent green
- `warm-terracotta` - Accent warm tone
- `deep-slate` - Dark neutral
- `rich-forest` - Deep green
- `soft-sage` - Light green/sage

**Typography**:
- Headings: `font-serif` (Playfair Display)
- Body: `font-sans` (Raleway)

**Custom Animations**:
- `animate-float` - Floating animation for decorative elements
- `animate-fade-in` - Fade in with slide up
- `animate-scale-in` - Scale in animation

### Path Aliases
Import paths use `@/` alias mapping to `./src/`:
```typescript
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
```

### Environment Configuration
Required environment variables in `.env`:
```
VITE_SUPABASE_PROJECT_ID
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_URL
```

### TypeScript Configuration
- Lenient settings: `noImplicitAny: false`, `strictNullChecks: false`
- Unused parameters and locals allowed
- `allowJs: true` for JS compatibility

## Integration Points

The following integrations are stubbed with TODOs in the codebase:

1. **Motion Calendar** - Consultation booking (Index.tsx:28)
2. **Qwilr API** - Brochure generation (Index.tsx:43)
3. **WhatsApp Business** - Video chat initiation (Index.tsx:58)
4. **AI/LLM** - Concept generation from user input (ChatInterface.tsx:68)
5. **Voice Recording** - Actual audio capture and transcription (ChatInterface.tsx:76)

## Lovable Integration

This project is managed via [Lovable](https://lovable.dev) (formerly GPT Engineer):
- Changes made in Lovable are auto-committed to this repo
- Uses `lovable-tagger` plugin in development mode for component tracking
- Deployment available through Lovable's Share → Publish workflow

## Development Notes

- ESLint configured with React Hooks rules and TypeScript support
- Unused vars lint rule disabled for flexibility
- Component-based architecture using shadcn/ui patterns
- All routes must be added above the catch-all `*` route in App.tsx
- Supabase client uses localStorage for auth persistence
