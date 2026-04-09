# Strategic Deepening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update vision.md and prd.md to reflect the deepened strategic framework from the strategic deepening spec.

**Architecture:** Sequential document rewrites — update vision.md section by section, then align prd.md. No code changes.

**Tech Stack:** Markdown documents only.

---

### Task 1: Rewrite vision.md — "What PocketCFO Is" section

**Files:**
- Modify: `docs/vision.md:22-29`

- [ ] **Step 1: Replace the "What PocketCFO Is" section**

Replace the current section (lines 22-29) with the infrastructure-first framing:

```markdown
## What PocketCFO Is

PocketCFO is financial decision infrastructure for institutions that serve low-income populations — CDFIs, employers, nonprofits, and government agencies. It provides verified, auditable financial guidance that these institutions can deploy to their populations as a white-labeled tool.

**The consumer app** (pocketcfo.com) is a public good and proof of concept. It demonstrates the tool's capabilities, serves anyone who finds it directly, and provides case study material for institutional buyers. It is not the business.

**The institutional product** is a customizable financial guidance engine: debt optimization, benefit eligibility, tax credit estimation, and action planning — tailored to the deploying institution's specific programs, populations, and geography. Every recommendation is traceable to a specific rule and source.

**Today**: A client-side web app that calculates debt payoff strategies, finds eligible benefits, estimates tax savings, and generates personalized action plans — all without collecting data or requiring sign-up. This is the demo.

**Tomorrow**: A deployable financial guidance engine with institution-specific customization, verified rules maintained across federal and state programs, and an audit trail that satisfies institutional compliance requirements.
```

- [ ] **Step 2: Verify the edit**

Read `docs/vision.md:22-35` and confirm the new section is in place with no formatting issues.

- [ ] **Step 3: Commit**

```bash
git add docs/vision.md
git commit -m "docs: reframe 'What PocketCFO Is' as institutional infrastructure"
```

---

### Task 2: Rewrite vision.md — "The AI Commoditization Question" section

**Files:**
- Modify: `docs/vision.md` — the section starting with `## The AI Commoditization Question`

- [ ] **Step 1: Replace the AI commoditization section**

Replace the entire `## The AI Commoditization Question` section (from its heading through the end of the numbered moat list) with:

```markdown
## The AI Commoditization Question

This is the central strategic question and we confront it directly:

**"Why wouldn't someone just ask ChatGPT?"**

The defensive answer — persistence, proactivity, domain safety, zero friction — has a 12-24 month shelf life. ChatGPT already has memory. Proactive notifications are a feature away. Free matters less when AI is bundled into devices people already own. Defending on these grounds is a losing race.

**The offensive answer: General-purpose AI structurally cannot be institutionally deployed for financial guidance.**

An employer cannot hand their hourly workers ChatGPT and say "use this for financial advice." An AI that hallucinates a $5,000 EITC when the real number is $2,400 causes real harm — and the employer is liable. A CDFI cannot deploy a tool whose outputs can't be audited. A nonprofit can't report impact metrics from a system with no deterministic logic.

PocketCFO occupies the position AI cannot: a compliance-safe, auditable, deterministic financial logic layer.

### The Architecture

```
[User] → [AI conversational layer] → [PocketCFO verified engine] → [Auditable output]
```

AI handles the human side: understanding a user's situation from natural language, explaining results in plain English, behavioral coaching. PocketCFO handles the side that can't be wrong: dollar amounts, eligibility determinations, deadline calculations. Every number the user sees passes through verified rules, not generation.

### Why This Gets Stronger Over Time

As AI gets better at conversation, PocketCFO's conversational layer matters less — but its verified engine matters *more*, because more AI interfaces need a trustworthy financial backend to call.

PocketCFO doesn't compete with AI. It becomes the layer AI talks *through*.

### The Principle

**AI for understanding and communication. Rules for numbers and eligibility. Never the reverse.**

This isn't just a safety principle. It's the entire competitive strategy.

### What This Means Concretely

| General AI | PocketCFO |
|---|---|
| Can't be deployed by institutions (liability, auditability) | Built for institutional deployment |
| Outputs can't be traced to a rule | Every recommendation cites its source |
| May hallucinate dollar amounts | Deterministic, verified calculations |
| Requires user to know what to ask | Tells you what you don't know you don't know |
| Forgets context between sessions | Maintains structured financial state |
| One-size-fits-all | Customized per institution, population, geography |
```

- [ ] **Step 2: Verify the edit**

Read the modified section and confirm formatting, no orphaned text from the old section.

- [ ] **Step 3: Commit**

```bash
git add docs/vision.md
git commit -m "docs: reframe AI thesis from defensive to offensive"
```

---

### Task 3: Rewrite vision.md — "Business Model" section

**Files:**
- Modify: `docs/vision.md` — the section starting with `## Business Model`

- [ ] **Step 1: Replace the business model section**

Replace the entire `## Business Model` section (from its heading through the "What we will never do" list) with:

```markdown
## Business Model

"Free forever" is a user promise, not a business model. PocketCFO must be sustainable without charging the people it serves — and without compromising their interests to generate revenue.

### Revenue model: Institutional deployment licensing

The only revenue path where the buyer's interests align with the user's interests. Institutions serving low-income populations pay for:

1. **White-labeled deployment** — PocketCFO customized for their population, with their branding, their programs, their geography. Per-institution annual fee, not per-user. This aligns incentives: the institution wants maximum usage, PocketCFO wants maximum usage, the user pays nothing.

2. **Custom benefit integration** — employer-specific benefits (401k match details, FSA, tuition reimbursement, EAP programs) and local programs baked into the tool.

3. **Aggregate impact dashboard** — anonymized, privacy-preserving metrics on benefit uptake rates, debt reduction progress, and financial stress indicators. Institutions need this for grant applications, CSR reports, and internal measurement.

4. **State-specific rules** — benefit eligibility, program deadlines, and thresholds for the institution's geographic coverage area.

### Sustainability for the public instance

The consumer app (pocketcfo.com) is a public good. It is sustained by:
- Foundation grants (Robin Hood Foundation, JPMorgan Chase Foundation, CFPB financial inclusion programs)
- Code for America partnership
- A percentage of institutional licensing revenue funding the public instance

This is the PBS model, taken seriously. Free for viewers. Funded by institutions whose interests are *aligned* with viewers' interests. The employer/nonprofit/CDFI *wants* their people to be financially stable. That alignment is the engine.

### Revenue paths eliminated (and why)

**Affiliate partnerships** — The constraint "never recommend a product that isn't the best option" is economically incompatible with affiliate revenue. Products that pay highest commissions need the most help getting customers, which correlates with being worse for the user. PocketCFO can't optimize for commissions without destroying its core asset: trust.

**Anonymized data insights** — Requires massive scale to be valuable. The privacy-first positioning makes data collection politically fraught even with differential privacy. Not relevant at current or near-future scale.

**Premium tier** — Creates free/paid tension that undermines the mission. The line between "convenience" and "essential" is impossible to hold. Bank sync is convenience until it's the only reason people return. Eliminated.

### What we will never do:
- Sell user data
- Recommend products for commission over user benefit
- Gate essential financial tools behind payment
- Show ads for predatory financial products
- Deploy a tool whose outputs can't be audited
```

- [ ] **Step 2: Verify the edit**

Read the modified section and confirm formatting.

- [ ] **Step 3: Commit**

```bash
git add docs/vision.md
git commit -m "docs: replace business model with B2B licensing + grant-funded public instance"
```

---

### Task 4: Rewrite vision.md — "Differentiation" section

**Files:**
- Modify: `docs/vision.md` — the section starting with `## Differentiation — What Makes This Irreplaceable`

- [ ] **Step 1: Replace the differentiation/moat section**

Replace the entire `## Differentiation — What Makes This Irreplaceable` section (from its heading through the competitive landscape table) with:

```markdown
## Differentiation — What Makes This Irreplaceable

### The Honest State of Defensibility

**What's defensible today**: Almost nothing. The current product is a well-designed calculator. Any fintech startup, bank, or AI company could replicate it in a week. There is no proprietary data, no network effect, no switching cost, no regulatory advantage.

**What must become defensible**: The competitive moat must be built, not assumed.

### Moat 1: Institutional integration depth (Primary)

Every CDFI deployment requires understanding that CDFI's specific programs, population, and workflows. Every employer deployment requires mapping their specific benefits package. This integration work is unsexy, manual, and cumulative. It's also the exact work a competitor would need to replicate for each institution they want to win.

This is the Salesforce moat — not technology, but accumulated institutional configuration. Each integration is a mini-moat that compounds over time.

**Moat strength: Strong once built.** Requires institutional sales and deployment, which doesn't exist yet. The moat doesn't form until the first deployment ships.

### Moat 2: Verified rules database

A comprehensive, version-controlled database of federal and state benefit eligibility rules, tax credit thresholds, and program deadlines — maintained and auditable. The IRS changes rules yearly. States change programs constantly. Maintaining this is expensive and boring, which means most competitors won't do it well.

**Moat strength: Medium.** Requires dedicated maintenance effort and eventually partnerships with organizations like Benefits.gov and Code for America who maintain similar datasets. The moat compounds with coverage — 50-state benefit rules are significantly harder to replicate than federal-only.

### Moat 3: Compliance/audit trail

Every recommendation PocketCFO makes is traceable to a specific rule with a specific source. "Recommended EITC because income = $34,000, dependents = 2, threshold = $X per IRS Publication Y." This auditability is worthless to a consumer. It is critical to an institution deploying the tool — if a user says "PocketCFO told me I qualified for X and I didn't," the institution needs to trace the logic.

General-purpose AI cannot provide this. This is the structural advantage that makes institutional deployment possible and that AI commoditization cannot erode.

**Moat strength: Strong in B2B context.** Meaningless for consumer use. This moat only activates under the institutional framing.

### Moat 4: Trust via institutional endorsement

Financial tools for low-income users fail when they feel like sales funnels. But trust isn't built from a website — it's inherited from the institution that deploys the tool. "Your employer offers this" or "your credit union recommends this" carries more weight than any privacy policy.

**Moat strength: Inherited, not built.** Depends on having institutional deployments. Without them, this moat doesn't exist.

### What's NOT a moat (dropped)

**Longitudinal intelligence** — Tracking user progress over time is a good UX feature. It's not a structural moat. Any competitor can copy it in weeks.

**Designed for financial illiteracy** — Using plain language instead of financial jargon makes the product better. It doesn't prevent competition. It's a UX philosophy, not a defensible position.

### The Competitive Landscape

| Competitor | What they do better | What PocketCFO does better |
|---|---|---|
| **NerdWallet / Bankrate** | Established brand, SEO dominance, comprehensive content | No affiliate-driven recommendations, institutional deployability |
| **Mint / Credit Karma** | Bank integration, credit score, automation | No data harvesting, compliance-safe, auditable |
| **ChatGPT / Claude** | Better at arbitrary financial conversation | Deterministic outputs, auditable, institutionally deployable |
| **VITA / NFCC counselors** | Human empathy, complex situation handling | Available 24/7, no appointment, no stigma, scales with deployment |
| **Employer wellness (Even, PayActiv)** | Payroll integration, earned wage access | Not tied to a single employer, portable, open |

**The gap PocketCFO fills**: No existing tool is (a) free for end users, (b) compliance-safe for institutions, (c) customizable per deployment, (d) auditable, and (e) designed for people who earn under $50K. Each competitor covers 2-3. No one covers all 5.
```

- [ ] **Step 2: Verify the edit**

Read the modified section and confirm formatting.

- [ ] **Step 3: Commit**

```bash
git add docs/vision.md
git commit -m "docs: revise moat framework — institutional integration depth as primary"
```

---

### Task 5: Rewrite vision.md — "Weakest Assumptions" section

**Files:**
- Modify: `docs/vision.md` — the section starting with `## Weakest Assumptions`

- [ ] **Step 1: Replace the weakest assumptions section**

Replace the entire `## Weakest Assumptions (Honest Assessment)` section with:

```markdown
## Weakest Assumptions (Honest Assessment)

### Assumption 1: "Institutions will pay for this"
**This is the existential assumption.** If CDFIs, employers, and nonprofits don't see enough value to pay for white-label deployment, the entire sustainability thesis collapses.

**Why this might be fatal**: Enterprise sales cycles are 6-18 months. CDFIs operate on tight budgets. Employers have existing financial wellness vendors (Even, PayActiv, SmartDollar). Breaking into institutional procurement requires: a sales function, enterprise features (SSO, admin dashboards, usage reporting), compliance certifications, and data processing agreements. None of this can be bootstrapped by a solo developer.

**Mitigation — the wedge**: Don't try to sell broadly. Find one institution willing to pilot. CDFIs are the best first target because (a) their mission is explicitly financial inclusion, (b) they're smaller and less bureaucratic than employers, (c) many have innovation budgets from CDFI Fund grants. Start with one CDFI. Prove the tool reduces financial stress calls, increases benefit uptake. Use that case study — with real numbers — to approach the next institution.

**Alternative path**: If institutional sales prove too slow, consider a nonprofit structure with grant funding. The tool's mission aligns with major foundation priorities (JPMorgan Chase Foundation, Robin Hood Foundation, CFPB financial inclusion programs). A 501(c)(3) with grant funding is a valid alternative to B2B sales.

### Assumption 2: "Low-income users will engage with a web app (even when deployed by institutions)"
**Challenge**: Distribution through institutions solves the "how do people find this" problem. It doesn't solve the "how do people use this" problem. The populations who need this most have the least time, the most decision fatigue, and the most reason to distrust financial tools.

**Mitigation**: The tool must deliver value in under 2 minutes on a first visit. The benefit-finding flow — "enter your income and household size, see what you're leaving on the table" — is the highest-value, lowest-friction entry point. Lead with that, not a 5-step financial assessment. The institution's endorsement reduces trust barriers but doesn't eliminate them.

### Assumption 3: "Rule-based calculations stay accurate"
**Challenge**: Tax laws change yearly. Benefit thresholds shift. State-level programs vary wildly. Hardcoded numbers decay.

**Mitigation**: This is a real engineering problem. The system needs a data layer that can be updated independently of the application. Tax rules, benefit thresholds, and eligibility criteria must be configuration, not code. Partnership with organizations that already maintain these datasets (Code for America, Benefits.gov) is eventually necessary.

### Assumption 4: "Privacy-first and free forever is sustainable"
**Challenge**: No data collection means no data monetization. No accounts mean no engagement metrics. No revenue from users means all revenue must come from institutions or grants.

**The deeper tension**: "Privacy-first" and "institutional deployment" have a nuance: institutions want aggregate usage metrics and impact data. This requires some form of analytics, even if anonymized and privacy-preserving.

**Resolution — privacy is a spectrum, not a binary**:
- **Tier 0 (default)**: No account, localStorage only. Full functionality, fragile persistence. This always works.
- **Tier 1 (institutional deployment)**: Anonymous usage analytics for the deploying institution. No PII. Aggregate metrics only (number of assessments, benefit categories surfaced, debt strategies generated). The institution sees population-level data, never individual data.
- **Tier 2 (opt-in by user)**: Account with encrypted sync for longitudinal tracking. Enables progress tracking, deadline reminders, and the persistent advisor features. Optional. The free, private, no-account version always works.

### Assumption 5: "The impact metrics shown today are credible"
**Challenge**: The landing page claims "$12.4M saved for users" and "84,000 strategies generated." These are fabricated. Trust is the product. Fabricated metrics destroy the product.

**Mitigation**: Remove fabricated metrics immediately. Replace with verifiable methodology claims ("calculated using IRS Publication 596 thresholds and federal benefit eligibility rules") or remove the section entirely until real deployment data exists.
```

- [ ] **Step 2: Verify the edit**

Read the modified section and confirm formatting.

- [ ] **Step 3: Commit**

```bash
git add docs/vision.md
git commit -m "docs: reorder weakest assumptions — institutional adoption as #1 risk"
```

---

### Task 6: Rewrite vision.md — "The Role of AI" section

**Files:**
- Modify: `docs/vision.md` — the section starting with `## The Role of AI`

- [ ] **Step 1: Replace the role of AI section**

Replace the entire `## The Role of AI (Honest Assessment)` section with:

```markdown
## The Role of AI (Honest Assessment)

PocketCFO calls itself an "AI financial advisor." Today, it has zero AI. Every calculation is deterministic rules. This gap must be addressed — either by adding AI where it genuinely helps, or by dropping the "AI" label.

### The strategic role of AI

AI is not PocketCFO's competitive advantage. The verified rules engine is. AI's role is to make the verified engine more accessible and more useful — never to replace it.

### Where AI adds real value:

1. **Natural language intake**: Instead of a 5-step form, let the user describe their situation conversationally. "I make $15/hr at Walmart, I have about $8K in credit card debt and $22K in student loans, and I want to buy a house someday." An LLM can extract structured data from this with less friction than form fields.

2. **Personalized explanation**: The current action plan says "Apply for EITC — estimated $2,400." An AI can say "You worked full-time at $15/hr last year with two kids — that qualifies you for the Earned Income Tax Credit. It's $2,400 deposited directly into your bank account when you file taxes. Here's exactly how to claim it."

3. **Edge case handling**: Rule-based systems break on edge cases. Self-employed income, irregular pay, gig workers with multiple 1099s, mixed immigration status households. An AI can reason about situations the rules don't cover — while flagging that its output is advisory, not deterministic.

4. **Behavioral coaching**: The hard part of financial planning isn't math — it's behavior. An AI can have an ongoing conversation about spending patterns, provide encouragement, and adapt its tone to the user's emotional state.

5. **Institutional customization**: An AI layer can adapt the tool's language, examples, and tone for different institutional contexts — a CDFI in rural Appalachia vs. an employer program for urban hourly workers — without changing the underlying rules engine.

### Where AI is dangerous:

1. **Dollar amounts**: An LLM that hallucinates "$5,000 EITC" when the real number is $2,400 causes real harm. All dollar figures must come from verified rules, never from AI generation.

2. **Eligibility determination**: "You qualify for Medicaid" is a legal claim. AI should surface possibilities, not make determinations.

3. **Investment advice**: Anything resembling securities advice triggers regulatory requirements (SEC, FINRA). PocketCFO must never cross this line.

### The integration principle:
**AI for understanding and communication. Rules for numbers and eligibility. Never the reverse.**

This principle is the foundation of both product safety and competitive strategy. It's what makes PocketCFO institutionally deployable where general AI is not.
```

- [ ] **Step 2: Verify the edit**

Read the modified section and confirm formatting.

- [ ] **Step 3: Commit**

```bash
git add docs/vision.md
git commit -m "docs: elevate AI principle from safety guideline to competitive strategy"
```

---

### Task 7: Rewrite vision.md — "Roadmap Thesis" section

**Files:**
- Modify: `docs/vision.md` — the section starting with `## Roadmap Thesis`

- [ ] **Step 1: Replace the roadmap thesis section**

Replace the entire `## Roadmap Thesis` section with:

```markdown
## Roadmap Thesis

The path from "calculator" to "irreplaceable" has three phases:

### Phase 1: Honest Calculator + First Deployment (now)

Ship a tool that does basic financial math correctly, finds real benefits, and respects privacy. Remove false claims. Be useful to one person today rather than impressive to no one.

Then find one institution willing to deploy it.

**Critical question for Phase 1**: Will one institution deploy this for their population, and does it measurably improve outcomes? If not, the product thesis is wrong — not the technology, but the go-to-market. Consumer retention (does anyone come back?) matters for credibility, but the existential question is institutional adoption.

**What "deployment" means concretely**: A CDFI or employer links to a customized version of PocketCFO (branded for their organization, configured with their specific benefits/programs). They promote it to their population. PocketCFO measures aggregate engagement and outcomes. That measurement becomes the case study for the next deployment.

### Phase 2: Institutional Platform

The product transitions from "a tool institutions can link to" to "a platform institutions configure and deploy." This is where the moat begins.

Concrete capabilities:
- **White-label deployment**: custom branding, custom domain, institution-specific landing page
- **Benefit configuration**: institution-specific programs (employer 401k details, local CDFI programs, state benefits)
- **Impact dashboard**: aggregate, anonymized metrics — assessments completed, benefits surfaced, estimated dollar impact
- **Audit trail**: every recommendation traceable to a specific rule and source
- **Optional user persistence**: encrypted sync for users who opt in, enabling longitudinal tracking

**Success metric**: 3+ institutional deployments with measured outcomes (benefit uptake, engagement, user satisfaction).

### Phase 3: Action Engine

Move from "here's what to do" to "I'll do it." Pre-fill benefit applications. Connect to tax filing services. Automate savings transfers. Partner with financial institutions that serve low-income users.

**The litmus test for Phase 3**: If PocketCFO disappears from an institution's offering, does the institution notice within a week? If yes, the product is embedded infrastructure. If no, it was always optional.

Concrete capabilities:
- **Benefit application pre-fill**: generate completed forms for SNAP, Medicaid, LIHEAP
- **Tax filing handoff**: export data in a format that free tax filing tools (IRS Free File, VITA) can consume
- **Plaid integration**: auto-import transactions and balances (opt-in, privacy-preserving)
- **Calendar-aware nudges**: proactive alerts about filing deadlines, enrollment windows, benefit expirations — delivered through the institution's communication channels

This phase is where the verified engine thesis fully materializes. The rules database, institutional integrations, and audit trail compound into a system that AI can call but cannot replicate.
```

- [ ] **Step 2: Verify the edit**

Read the modified section and confirm formatting.

- [ ] **Step 3: Commit**

```bash
git add docs/vision.md
git commit -m "docs: revise roadmap — institutional deployment as Phase 1 success metric"
```

---

### Task 8: Rewrite vision.md — "What Kills This" section

**Files:**
- Modify: `docs/vision.md` — the section starting with `## What Kills This`

- [ ] **Step 1: Replace the death scenarios section**

Replace the entire `## What Kills This (Death Scenarios)` section with:

```markdown
## What Kills This (Death Scenarios)

### 1. No institutional buyers (CRITICAL)
If CDFIs and employers don't see enough value to pay for deployment, the sustainability thesis collapses. This is the single most important risk.
**Survival condition**: Get one deployment live before building anything else. One case study with real numbers opens the door to the next. If three institutions say no after seeing a working demo with real outcomes, the B2B thesis is wrong and the model must change.

### 2. A well-funded nonprofit builds this first
Code for America, Khan Academy, or a major foundation decides to build exactly this tool with a $5M grant and a team of 20. They have more credibility, resources, and institutional relationships.
**Survival condition**: Speed and specificity. Be deployed at one institution before they finish their RFP process. The advantage of being small is deploying in weeks, not years. If this happens, consider: is partnership better than competition?

### 3. Google/Apple ships it as a built-in
If Google adds "financial health" to Google Pay or Apple adds benefit-finding to Wallet, the consumer app is instantly redundant. Under the infrastructure framing, this is less threatening — Google/Apple won't build custom CDFI deployments.
**Survival condition**: Be embedded in institutional workflows before this happens. The consumer app is expendable. The institutional deployments are not.

### 4. Regulation blocks the advice
Financial advice is regulated. If PocketCFO's recommendations are classified as "financial advice" rather than "financial education," it may need licensing. The B2B model helps — deploying institutions likely have compliance infrastructure.
**Survival condition**: Stay on the "education and tools" side of the line. Show calculations and options. Never say "you should" — say "here's what the math shows." Consult a fintech attorney before Phase 2. The audit trail (every recommendation traceable to a rule) is a regulatory asset.

### 5. AI gets persistent memory and proactive features
If ChatGPT gains persistent user profiles and proactive alerts, the consumer app's differentiation shrinks. Under the engine framing, this is less threatening — persistent AI still can't provide auditable, compliance-safe recommendations for institutional deployment.
**Survival condition**: The verified engine thesis. PocketCFO's value is not "better than AI at conversation" — it's "the thing AI calls when it needs verified financial logic."

### 6. Rules database falls out of date
Tax laws change yearly, benefit thresholds shift, state programs evolve. If the rules database decays, every recommendation becomes unreliable and the compliance/audit moat collapses.
**Survival condition**: Partnership with organizations that maintain these datasets (Benefits.gov, Code for America, state benefit agencies). Rules must be configuration, not code — updatable without engineering effort.
```

- [ ] **Step 2: Verify the edit**

Read the modified section and confirm formatting.

- [ ] **Step 3: Commit**

```bash
git add docs/vision.md
git commit -m "docs: revise death scenarios — no institutional buyers as #1 risk"
```

---

### Task 9: Update prd.md — Phase 1 priorities and success metrics

**Files:**
- Modify: `docs/prd.md`

- [ ] **Step 1: Replace the Status line**

Change line 3 from:
```markdown
## Status: Phase 1 (Honest Calculator)
```
to:
```markdown
## Status: Phase 1 (Honest Calculator + First Deployment)
```

- [ ] **Step 2: Add institutional deployment to P0 priorities**

After the existing P0 table (the "Credibility" section), add a new P0 section:

```markdown
### P0: First Institutional Deployment

| Item | Status | Notes |
|------|--------|-------|
| Identify first CDFI or employer willing to pilot | PLANNED | CDFIs are best first target — mission-aligned, smaller procurement cycles |
| Build white-label/branding configuration | PLANNED | Custom logo, colors, institution name, landing page |
| Add institution-specific benefit configuration | PLANNED | Map deploying institution's specific programs into benefits finder |
| Add aggregate analytics (anonymized) | PLANNED | Assessment count, benefit categories surfaced, estimated dollar impact — no PII |
| Deploy and measure outcomes | PLANNED | Benefit uptake rates, engagement metrics, user satisfaction |
| Write case study from first deployment | PLANNED | Real numbers, real outcomes — this sells the next deployment |
```

- [ ] **Step 3: Update Phase 2 description**

Replace the `## Phase 2: Persistent Advisor (Next)` section with:

```markdown
## Phase 2: Institutional Platform (Next)

Depends on Phase 1 first deployment validation.

### Core capabilities:
- White-label deployment infrastructure (custom branding, domain, landing page)
- Institution-specific benefit configuration dashboard
- Aggregate impact dashboard (anonymized metrics for grant reporting)
- Audit trail (every recommendation traceable to rule + source)
- Optional encrypted user sync (anonymous, key-based, for longitudinal tracking)
- State-specific benefit eligibility rules (beyond federal-only)

### Success metric:
**3+ institutional deployments with measured outcomes** — benefit uptake increase, engagement rates, user satisfaction scores.
```

- [ ] **Step 4: Update Phase 1 success metric**

Find the existing Phase 1 success metric in the P2 section:
```markdown
### Success metric:
**30-day return rate > 20%** — users who complete assessment and return within 30 days to update their data.
```

This is being moved to Phase 2's optional persistence features. The new Phase 1 success metric should be added at the end of the P0 section:

```markdown
### Phase 1 Success Metric:
**One institutional deployment live with measured outcomes.** Consumer 30-day return rate > 20% is a secondary metric for demo credibility.
```

- [ ] **Step 5: Verify the edits**

Read the full `docs/prd.md` and confirm all sections are consistent.

- [ ] **Step 6: Commit**

```bash
git add docs/prd.md
git commit -m "docs: align PRD with institutional infrastructure framing"
```

---

### Task 10: Update CLAUDE.md project description

**Files:**
- Modify: `CLAUDE.md:1-3`

- [ ] **Step 1: Update the project description**

Replace:
```markdown
# PocketCFO

AI financial advisor that gives minimum-wage workers the same quality financial planning that millionaires get.
```

With:
```markdown
# PocketCFO

Financial decision infrastructure for institutions serving low-income populations. Verified, auditable financial guidance — debt optimization, benefit eligibility, tax credit estimation — deployed by CDFIs, employers, and nonprofits as a white-labeled tool. Consumer app at pocketcfo.com serves as public demo and proof of concept.
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md project description to match infrastructure framing"
```

---

### Task 11: Final verification

- [ ] **Step 1: Read through updated vision.md end-to-end**

Read the full file. Check for:
- Orphaned text from old sections
- Section ordering that doesn't flow
- Internal contradictions between sections
- The "Who This Is For" closing section — it should still work with the infrastructure framing

- [ ] **Step 2: Read through updated prd.md end-to-end**

Read the full file. Check for:
- Consistency with vision.md changes
- No references to eliminated revenue paths (affiliates, premium tier)
- Phase ordering makes sense

- [ ] **Step 3: Fix any issues found**

Make targeted edits for any inconsistencies.

- [ ] **Step 4: Final commit if needed**

```bash
git add docs/vision.md docs/prd.md
git commit -m "docs: fix consistency issues from strategic deepening pass"
```
