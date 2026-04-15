import { Card, Grid, Group, SimpleGrid, Text, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import api from '../api/client'

export function FinancePage() {
  const { data } = useQuery({
    queryKey: ['finance'],
    queryFn: async () => (await api.get('/api/v1/business/finance')).data
  })
  const net = data?.net ?? 0
  const pieData = [
    { name: 'Income', value: data?.income ?? 0 },
    { name: 'Expense', value: data?.expense ?? 0 },
    ...(net > 0 ? [{ name: 'Net', value: net }] : [])
  ]

  return (
    <>
      <Group justify="space-between" mb="md">
        <Title order={3}>Finance</Title>
        <Text c="dimmed" size="sm">Income vs expense overview</Text>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 3 }} mb="md">
        <Card withBorder radius="md">
          <Text c="dimmed" size="sm">Income</Text>
          <Text fw={800} size="xl">₹{(data?.income ?? 0).toLocaleString()}</Text>
        </Card>
        <Card withBorder radius="md">
          <Text c="dimmed" size="sm">Expense</Text>
          <Text fw={800} size="xl">₹{(data?.expense ?? 0).toLocaleString()}</Text>
        </Card>
        <Card withBorder radius="md">
          <Text c="dimmed" size="sm">Net</Text>
          <Text fw={800} size="xl">₹{(data?.net ?? 0).toLocaleString()}</Text>
        </Card>
      </SimpleGrid>

      <Grid>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card withBorder radius="md" h={320}>
            <Title order={5} mb="sm">Income Distribution</Title>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={100}
                >
                  <Cell fill="#12b886" />
                  <Cell fill="#fa5252" />
                  {net > 0 && <Cell fill="#4c6ef5" />}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {net < 0 && (
              <Text c="orange" size="xs" mt="xs">
                Net is negative this cycle and is excluded from the distribution ring.
              </Text>
            )}
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Card withBorder radius="md" h={320}>
            <Title order={5} mb="sm">Financial Health</Title>
            <Text mt="md">Profit Margin</Text>
            <Text fw={700} size="xl">
              {data?.income ? `${Math.round(((data.net ?? 0) / data.income) * 100)}%` : '0%'}
            </Text>
            <Text mt="lg">Payout Readiness</Text>
            <Text fw={700} size="xl">
              {data?.net && data.net > 0 ? 'Ready' : 'Needs Attention'}
            </Text>
            <Text mt="lg">Status</Text>
            <Text c="dimmed">Monitor expenses to improve monthly net.</Text>
          </Card>
        </Grid.Col>
      </Grid>
    </>
  )
}
