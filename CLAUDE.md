# PocketCFO

Financial decision infrastructure for institutions serving low-income populations. Verified, auditable financial guidance — debt optimization, benefit eligibility, tax credit estimation — deployed by CDFIs, employers, and nonprofits as a white-labeled tool. Consumer app at pocketcfo.com serves as public demo and proof of concept.

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
