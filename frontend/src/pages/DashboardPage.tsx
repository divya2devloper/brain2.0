import { Card, Group, SimpleGrid, Text, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import api from '../api/client'

export function DashboardPage() {
  const { data } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => (await api.get('/api/v1/dashboard/metrics')).data
  })

  const cards = [
    ['Leads', data?.leads ?? 0],
    ['Active Members', data?.active_members ?? 0],
    ['Revenue', data?.monthly_revenue ?? 0],
    ['ROI', data?.roi ?? 0]
  ]

  return (
    <>
      <Title order={3} mb="md">Dashboard</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        {cards.map(([k, v]) => (
          <Card key={String(k)} withBorder>
            <Group justify="space-between">
              <Text>{k}</Text>
              <Text fw={700}>{String(v)}</Text>
            </Group>
          </Card>
        ))}
      </SimpleGrid>
    </>
  )
}
