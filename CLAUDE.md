# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BottleClub Tree is a zero-waste initiative visualization app built with Next.js 13 and React Three Fiber. It renders procedurally generated 3D trees using L-System algorithms, with trees growing based on user recycling activity (scores/points). The app is designed to be embedded in a React Native WebView and exports as static HTML for mobile app integration.

## Development Commands

```bash
# Development server
npm run dev

# Production build (exports to static HTML in /out directory)
npm run build

# Start production server on port 3040
npm start

# Lint and auto-fix
npm run lint

# Format check
npm run prettier

# Bundle analysis
npm run analyze
```

## Architecture

### Build Configuration

- **Static Export Mode**: Uses `output: 'export'` in next.config.js to generate static HTML/CSS/JS files for embedding in mobile apps
- **PWA Support**: Configured with @ducanh2912/next-pwa, disabled in development
- **Custom Webpack Loaders**:
  - Audio files (.ogg, .mp3, .wav, .mpeg) via url-loader
  - GLSL shaders (.glsl, .vs, .fs, .vert, .frag) via raw-loader and glslify-loader
- **Port**: Production server runs on port 3040 (see `npm start`)

### App Structure (Next.js 13 App Directory)

- **app/**: Next.js 13 app directory
  - `layout.tsx`: Root layout with metadata
  - `page.tsx`: Main page component that orchestrates the tree visualization

### Component Architecture

**DOM Layer** (`src/components/dom/`):
- Standard React components for UI overlays (Cover, Guide, Score, Loading)

**Canvas Layer** (`src/components/canvas/`):
- `View.tsx`: React Three Fiber view container with orthographic camera
- `Scene.tsx`: 3D scene setup

**Tree System** (`src/components/tree/`):
- `LSystemInstanced.tsx`: Core L-System algorithm implementation using instanced rendering
  - Generates procedural trees with branches, leaves, flowers, and fruits
  - Rules: `X: 'F[-FX][+FX]'`, `F: 'F'` with 3 iterations
  - Implements save/load system using IndexedDB
  - Grows trees incrementally based on user scores
- `TreeInstancesPool.tsx`: Instance pool manager for performance optimization
- `Tree.tsx`: Tree component wrapper
- `Background.tsx`: 3D background scene
- `db.ts`: Dexie (IndexedDB) database schema for persisting tree state

### State Management

**Zustand Store** (`src/stores/useTreeStore.ts`):
- `uid`: User identifier for tree persistence
- `total`: Total score accumulated
- `count`: Number of growth events
- `texturesLoaded`/`allTexturesLoaded`: Texture loading state
- `initThree`: Three.js initialization status

### Mobile Integration

**Message Passing** (`src/helpers/SendToMobile.ts`):
- Bidirectional communication with React Native WebView via `window.ReactNativeWebView.postMessage()`
- Message types handled in `app/page.tsx`:
  - `init`: Initialize tree with uid, total score, and count
  - `grow`: Grow tree by adding score points
  - `save`: Persist current tree state to IndexedDB
  - `load`: Load tree state from IndexedDB

Message format:
```json
{
  "type": "init|grow|save|load",
  "uid": "user_id",
  "total": 0,
  "count": 0,
  "score": 5,
  "force": false
}
```

### Data Persistence

**IndexedDB via Dexie** (`src/components/tree/db.ts`):
- `tree` table: Stores serialized tree geometry (path, pool, matrix) and metadata
- `option` table: Stores key-value pairs for user settings (total, count)
- Trees are saved/loaded per `uid`

### 3D Rendering Details

- **Camera**: Orthographic camera at `[0, 0, 10]` with zoom level 20
- **Rendering**: Instanced rendering for performance (branches, leaves, flowers, fruits)
- **Textures**: Located in `public/assets/`:
  - 5 branch variations (branch_v1-v5.png)
  - 5 flower variations (flower_v1-v5.png)
  - 6 fruit variations (fruit_v1-v6.png)
  - 7 leaf variations (leaf1_v1-v7.png)
- **Background**: Progressive backgrounds based on score thresholds (200, 300, 400, 500, 600, 700, 800) in `public/assets/backgrounds/`

### L-System Growth System

The tree grows based on condition points (30, 100, 300, 500, 1000, etc.) which unlock rewards:
- Scores 30-500: Unlock flowers (5 types)
- Scores 1000-2200: Unlock fruits (6 types)

Tree generation uses:
- Angle: 15 degrees
- Length scale: 0.75 (each branch segment is 75% of parent)
- Width scale: 0.93
- Reset count: 3 (controls branch regeneration cycles)

## Path Aliases

TypeScript paths configured in tsconfig.json:
```typescript
"@/*": ["app/*", "src/*"]
```

## Styling

- **Tailwind CSS**: JIT mode enabled
- **Custom Theme**:
  - Font family: `'score'` mapped to Voster typeface (in `public/fonts/`)
  - Custom color: `'score': '#4381CF'`

## Important Implementation Notes

1. **Static Export Limitation**: Next.js Image optimization is disabled due to static export mode
2. **Three.js Integration**: Uses `tunnel-rat` for portal-based rendering between DOM and Canvas
3. **TypeScript**: Strict mode disabled (`strict: false`), several files use `//@ts-nocheck`
4. **Hydration**: Many components use `'use client'` directive for client-side rendering
5. **Mobile Detection**: `useMobileStatus` hook checks user agent for Mobile/Android/iPhone
6. **Development**: Test buttons for grow/init/save/load are commented out in production (`app/page.tsx:175`)
