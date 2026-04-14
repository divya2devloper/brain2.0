import { Container, Text, Title } from '@mantine/core'

export function NotFoundPage() {
  return (
    <Container py="xl">
      <Title order={2}>404</Title>
      <Text>Page not found.</Text>
    </Container>
  )
}
