import { Button, Container, PasswordInput, Stack, TextInput, Title } from '@mantine/core'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../auth/AuthContext'

export function OtpSignupPage() {
  const [email, setEmail] = useState('user@example.com')
  const [otp, setOtp] = useState('')
  const [username, setUsername] = useState('owner')
  const [password, setPassword] = useState('pass123')
  const [sent, setSent] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const sendOtp = async () => {
    await api.post('/api/v1/auth/send-otp', { email })
    setSent(true)
  }

  const verifyAndOnboard = async () => {
    await api.post('/api/v1/auth/verify-otp', { email, otp })
    const { data } = await api.post('/api/v1/auth/onboarding', { username, password, role: 'OWNER' })
    login(data.token, data.user)
    navigate('/app/dashboard')
  }

  return (
    <Container size="xs" py="xl">
      <Stack>
        <Title order={2}>Signup with Gmail OTP</Title>
        <TextInput label="Email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
        <Button onClick={sendOtp}>Send OTP</Button>
        {sent && (
          <>
            <TextInput label="OTP" value={otp} onChange={(e) => setOtp(e.currentTarget.value)} />
            <TextInput label="Username" value={username} onChange={(e) => setUsername(e.currentTarget.value)} />
            <PasswordInput label="Password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} />
            <Button onClick={verifyAndOnboard}>Verify & Onboard</Button>
          </>
        )}
      </Stack>
    </Container>
  )
}
