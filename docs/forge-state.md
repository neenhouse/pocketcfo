# Forge State

Last updated: 2026-04-12

## Current Phase
Phase 1: Honest Calculator + First Deployment

## Last Completed Tasks
1. P2: Assessment versioning — sectionTimestamps on profile, pre-populate on retake, 14-day freshness banner on dashboard
2. P2: Return visit detection — returning users auto-redirect from landing page to dashboard (bypass with ?new=1)
3. P2: Data export/import — JSON backup/restore via Export Data / Import Data buttons on dashboard
4. P1: Externalized all hardcoded thresholds to src/lib/rules/federal.ts
4. P1: Added source citations to all benefit cards + tax year indicator
5. P0: Removed fabricated impact metrics — replaced with verifiable methodology claims

## Next Priorities
P2: Rules database architecture (versioned, multi-state benefit rules data model)
P0 Institutional: White-label branding config (needs real CDFI to validate against)

## Open PLANNED Items (from PRD)
### P0 Credibility
- Remove fabricated impact metrics (LandingPage.tsx)
- Replace with verifiable claims or remove section

### P0 Institutional Deployment Readiness
- White-label branding configuration
- Institution-specific benefit configuration
- Aggregate analytics (anonymized)
- Audit trail for recommendations
- Deploy pilot and measure outcomes
- Write case study

### P1 Accuracy
- Externalize tax thresholds (hardcoded in strategy.ts, BenefitsFinderPage.tsx)
- Add data source citations
- Add "last updated" dates
- State-level benefit rules for pilot state

### P2 Foundation
- Data export/import
- Assessment versioning
- Return visit detection
- Rules database architecture
