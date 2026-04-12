/**
 * White-label branding configuration.
 *
 * This module defines the branding config used across the app. To create an
 * institutional deployment, create a new config object and set it as the
 * active branding. No code changes required — just config.
 *
 * Phase 1: Static import (one config per build/deploy)
 * Phase 2: Dynamic loading from JSON URL or environment variables
 */
import type { BenefitRule } from './rules/types'

export interface BrandingConfig {
  /** Institution or deployment name (shown in header, footer) */
  appName: string
  /** Short tagline (footer, meta description) */
  tagline: string
  /** Copyright line */
  copyright: string

  /** Hero section */
  hero: {
    badge: string
    title: string
    titleAccent: string
    subtitle: string
    ctaLabel: string
    secondaryCtaLabel: string
  }

  /** Final CTA section */
  cta: {
    title: string
    subtitle: string
    buttonLabel: string
  }

  /** Color overrides — applied as CSS custom properties */
  colors?: {
    accent?: string       // Replaces --gold-400 / --accent
    accentDark?: string   // Replaces --gold-600
    primary?: string      // Replaces --green-800
    primaryDark?: string  // Replaces --green-950 / --bg
  }

  /** Custom logo URL. If not set, uses the default PocketCFO coin SVG */
  logoUrl?: string

  /** Show "Powered by PocketCFO" in footer for white-label deployments */
  showPoweredBy: boolean

  /**
   * Institution-specific benefit rules.
   * These are merged with federal rules in the benefits finder.
   * Rules with the same ID as a federal rule override it (state/local > federal).
   */
  institutionRules?: BenefitRule[]
}

/** Default branding: PocketCFO consumer app */
export const defaultBranding: BrandingConfig = {
  appName: 'PocketCFO',
  tagline: 'Millionaire advice. Minimum wage price.',
  copyright: 'PocketCFO. Not financial advice, but pretty close.',

  hero: {
    badge: 'Free forever. No credit card. No catch.',
    title: 'Minimum Wage Price.',
    titleAccent: 'Millionaire Advice.',
    subtitle: "The same caliber of financial strategy that costs $500/hour from a wealth manager.",
    ctaLabel: 'Get Your Strategy',
    secondaryCtaLabel: 'See How It Works',
  },

  cta: {
    title: "Your income doesn't determine the quality of advice you deserve.",
    subtitle: 'Takes 3 minutes. Changes everything.',
    buttonLabel: 'Get Your Free Strategy',
  },

  showPoweredBy: false,
}

/**
 * Example institutional branding — demonstrates what a CDFI deployment looks like.
 * Not used in production; serves as documentation and test fixture.
 */
export const exampleCdfiBranding: BrandingConfig = {
  appName: 'Financial Navigator',
  tagline: 'Powered by Community First CDFI',
  copyright: 'Community First CDFI',

  hero: {
    badge: 'Free for all Community First clients',
    title: 'Know What You Qualify For.',
    titleAccent: 'Your Benefits.',
    subtitle: 'Community First CDFI built this tool to help you find tax credits, government programs, and savings you may be missing.',
    ctaLabel: 'Start Your Assessment',
    secondaryCtaLabel: 'See What We Check',
  },

  cta: {
    title: 'Your counselor recommended this tool for a reason.',
    subtitle: "3 minutes to see what you're eligible for.",
    buttonLabel: 'Start Now',
  },

  colors: {
    accent: '#3B82F6',     // Blue instead of gold
    accentDark: '#1D4ED8',
    primary: '#1E3A5F',
    primaryDark: '#0F1D2F',
  },

  showPoweredBy: true,

  institutionRules: [
    {
      id: 'cf-emergency-grant',
      name: 'Community First Emergency Grant',
      description: 'One-time $500 emergency grant for Community First CDFI clients facing unexpected expenses. No repayment required.',
      category: 'government',
      source: 'Community First CDFI — Client Services (2025)',
      taxYear: 2025,
      jurisdiction: 'OH',
      applies: () => true,
      eligible: (_profile, annualIncome) => annualIncome < 45000,
      estimatedValue: () => 500,
      requirements: () => [
        'Active Community First client',
        'Income under $45,000',
        'Apply through your counselor',
      ],
    },
    {
      id: 'cf-financial-coaching',
      name: 'Free Financial Coaching',
      description: 'One-on-one financial coaching sessions with a certified counselor. Available to all Community First clients at no cost.',
      category: 'government',
      source: 'Community First CDFI — Coaching Program (2025)',
      taxYear: 2025,
      jurisdiction: 'OH',
      applies: () => true,
      eligible: () => true,
      estimatedValue: () => 600, // ~$100/session x 6 sessions
      requirements: () => [
        'Active Community First client',
        'Schedule through client portal',
      ],
    },
  ],
}

/**
 * Active branding config for this deployment.
 *
 * To switch branding:
 * - Phase 1: Change this import to point to a different config
 * - Phase 2: Load dynamically from /config/branding.json or env var
 */
export const branding: BrandingConfig = defaultBranding
