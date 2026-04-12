import { type ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import { branding } from '../../lib/branding'

interface LayoutProps {
  children: ReactNode
}

function BrandingOverrides() {
  if (!branding.colors) return null
  const { accent, accentDark, primary, primaryDark } = branding.colors
  const vars: string[] = []
  if (accent) {
    vars.push(`--gold-400: ${accent}`)
    vars.push(`--accent-light: ${accent}`)
    vars.push(`--border-focus: ${accent}`)
  }
  if (accentDark) {
    vars.push(`--gold-600: ${accentDark}`)
    vars.push(`--accent: ${accentDark}`)
  }
  if (primary) {
    vars.push(`--green-800: ${primary}`)
    vars.push(`--primary: ${primary}`)
  }
  if (primaryDark) {
    vars.push(`--green-950: ${primaryDark}`)
    vars.push(`--primary-dark: ${primaryDark}`)
    vars.push(`--bg: ${primaryDark}`)
  }
  if (vars.length === 0) return null
  return <style>{`:root { ${vars.join('; ')} }`}</style>
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <BrandingOverrides />
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      <Header />
      <main id="main-content" style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  )
}
