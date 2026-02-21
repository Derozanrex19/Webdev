# Lifewood AI Data Solutions

Single-command local setup for both Windows PC and macOS (including Big Sur 11.7).

## Requirements

- Node.js 18+ (Node 18 LTS recommended, especially for macOS Big Sur 11.7)
- npm (bundled with Node)

Pinned Node version files are included:
- `.nvmrc`
- `.node-version`

## Quick Start (one command)

```bash
npm run go
```

What `npm run go` does automatically:
1. Verifies Node version compatibility.
2. Installs dependencies with `npm ci` if `node_modules` is missing.
3. Creates `.env.local` from `.env.example` if missing.
4. Starts Vite dev server on `http://127.0.0.1:5173`.

## Optional Gemini Setup

Set your API key in `.env.local`:

```env
GEMINI_API_KEY=your_key_here
```

If omitted, the app still runs; IVA chat returns a configuration message.

## Utility Commands

```bash
npm run setup   # Setup only (no dev server)
npm run doctor  # Environment diagnostics
npm run dev     # Start dev server directly
npm run build   # Production build
npm run preview # Preview production build
```
