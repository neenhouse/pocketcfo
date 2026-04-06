import { type ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      <Header />
      <main id="main-content" style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  )
}
