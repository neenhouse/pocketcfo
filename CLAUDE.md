# PocketCFO

AI financial advisor that gives minimum-wage workers the same quality financial planning that millionaires get.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8
- **Styling**: CSS custom properties (gold/green design system)
- **Deploy**: Cloudflare Pages via GitHub Actions
- **Tooling**: pnpm (package manager), mise (runtime versions)

## Commands

```bash
pnpm dev           # Start dev server
pnpm build         # TypeScript check + Vite production build
pnpm test          # Run Vitest
pnpm lint          # ESLint
```

## Conventions

- Use **pnpm** as package manager
- Use **mise** for runtime versions (see `.mise.toml`)
- CSS custom properties for theming
- React Router for navigation
- localStorage for financial data persistence
- No external UI libraries
- No chart libraries (CSS/SVG only)
