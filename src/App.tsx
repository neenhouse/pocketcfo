import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from './components/layout/Layout'
import ErrorBoundary from './components/ErrorBoundary'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const AssessmentPage = lazy(() => import('./pages/AssessmentPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const DebtOptimizerPage = lazy(() => import('./pages/DebtOptimizerPage'))
const BenefitsFinderPage = lazy(() => import('./pages/BenefitsFinderPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          aria-hidden="true"
          style={{
            width: 40,
            height: 40,
            border: '3px solid var(--border)',
            borderTopColor: 'var(--accent)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }}
        />
        <p>Loading your strategy...</p>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg) } }
          @media (prefers-reduced-motion: reduce) { .loading-spinner { animation: none !important; } }
        `}</style>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/debt-optimizer" element={<DebtOptimizerPage />} />
            <Route path="/benefits" element={<BenefitsFinderPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  )
}
