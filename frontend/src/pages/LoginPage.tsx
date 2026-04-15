import { Button, Container, PasswordInput, Stack, TextInput, Title } from '@mantine/core'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../auth/AuthContext'

export function LoginPage() {
  const [username, setUsername] = useState('owner')
  const [password, setPassword] = useState('pass123')
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async () => {
    const { data } = await api.post('/api/v1/auth/login', { username, password })
    login(data.token, data.user)
    navigate('/app/dashboard')
  }

  return (
    <Container size="xs" py="xl">
      <Stack>
        <Title order={2}>Login</Title>
        <TextInput value={username} onChange={(e) => setUsername(e.currentTarget.value)} label="Username" />
        <PasswordInput value={password} onChange={(e) => setPassword(e.currentTarget.value)} label="Password" />
        <Button onClick={onSubmit}>Login</Button>
      </Stack>
    </Container>
  )
}
