import { MantineProvider } from '@mantine/core'
import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LegalGatewayModal } from './components/LegalGatewayModal'
import { useAuth } from './auth/AuthContext'
import { AppShellLayout } from './layouts/AppShellLayout'
import { BillingPage } from './pages/BillingPage'
import { DashboardPage } from './pages/DashboardPage'
import { DemoPage } from './pages/DemoPage'
import { FinancePage } from './pages/FinancePage'
import { InstagramPage } from './pages/InstagramPage'
import { LandingPage } from './pages/LandingPage'
import { LeadsPage } from './pages/LeadsPage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { OtpSignupPage } from './pages/OtpSignupPage'
import { SettingsPage } from './pages/SettingsPage'
import { TrainingPage } from './pages/TrainingPage'
import { WhatsAppPage } from './pages/WhatsAppPage'

function Protected({ children }: { children: JSX.Element }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/auth/login" replace />
}

export default function App() {
  const [legalRequired, setLegalRequired] = useState(false)

  useEffect(() => {
    const handler = () => setLegalRequired(true)
    window.addEventListener('brain:legal-required', handler)
    return () => window.removeEventListener('brain:legal-required', handler)
  }, [])

  return (
    <MantineProvider defaultColorScheme="light">
      <LegalGatewayModal opened={legalRequired} onClose={() => setLegalRequired(false)} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<OtpSignupPage />} />

        <Route
          path="/app"
          element={
            <Protected>
              <AppShellLayout />
            </Protected>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="whatsapp" element={<WhatsAppPage />} />
          <Route path="instagram" element={<InstagramPage />} />
          <Route path="finance" element={<FinancePage />} />
          <Route path="training" element={<TrainingPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </MantineProvider>
  )
}
