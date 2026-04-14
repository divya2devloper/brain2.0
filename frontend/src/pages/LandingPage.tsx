import { Button, Container, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router-dom'

export function LandingPage() {
  return (
    <Container py="xl">
      <Stack>
        <Title order={1}>Brain 2.0 Gym CRM</Title>
        <Text>AI-assisted WhatsApp/Instagram lead growth and gym operations platform.</Text>
        <Button component={Link} to="/auth/login" w={180}>Get Started</Button>
      </Stack>
    </Container>
  )
}
