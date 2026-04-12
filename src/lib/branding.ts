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
}

/**
 * Active branding config for this deployment.
 *
 * To switch branding:
 * - Phase 1: Change this import to point to a different config
 * - Phase 2: Load dynamically from /config/branding.json or env var
 */
export const branding: BrandingConfig = defaultBranding
