import { Button, Group, Title } from '@mantine/core'
import api from '../api/client'

export function BillingPage() {
  return (
    <>
      <Title order={3} mb="md">Billing</Title>
      <Group>
        <Button onClick={() => void api.post('/api/v1/billing/upgrade', { plan: 'pro' })}>Upgrade</Button>
        <Button variant="light" onClick={() => void api.post('/api/v1/billing/addon', { addon: 'ai-pack' })}>Add-on</Button>
      </Group>
    </>
  )
}
