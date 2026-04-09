# Forge State

Last updated: 2026-04-09

## Current Phase
Phase 1: Honest Calculator + First Deployment

## Last Completed Tasks
1. Deep docs evolution pass on vision.md and prd.md (human need thesis, buyer profiles, flywheel, 5-year survival)
2. P0: Removed fabricated impact metrics — replaced with verifiable methodology claims
3. P1: Externalized all hardcoded thresholds to src/lib/rules/federal.ts
4. P1: Added source citations to all benefit cards + tax year indicator

## Uncommitted Changes (ready to commit)
- docs/vision.md, docs/prd.md — major evolution + status updates
- src/lib/rules/federal.ts, src/lib/rules/index.ts — NEW: centralized rules
- src/lib/types.ts — added source field to Benefit interface
- src/lib/strategy.ts — imports from rules module
- src/pages/LandingPage.tsx — fabricated metrics replaced, AnimatedCounter removed
- src/pages/BenefitsFinderPage.tsx — source citations, tax year, rules imports
- src/pages/BenefitsFinderPage.css — source citation styles

## Next Priorities
P2: Return visit detection (show dashboard for returning users)
P2: Data export/import (JSON backup/restore)
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
