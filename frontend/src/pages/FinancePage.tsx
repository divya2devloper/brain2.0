import { Card, Text, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import api from '../api/client'

export function FinancePage() {
  const { data } = useQuery({
    queryKey: ['finance'],
    queryFn: async () => (await api.get('/api/v1/business/finance')).data
  })

  return (
    <>
      <Title order={3} mb="md">Finance</Title>
      <Card withBorder>
        <Text>Income: {data?.income ?? 0}</Text>
        <Text>Expense: {data?.expense ?? 0}</Text>
        <Text>Net: {data?.net ?? 0}</Text>
      </Card>
    </>
  )
}
