import { Card, Grid, Group, RingProgress, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import api from '../api/client'

export function DashboardPage() {
  const { data } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => (await api.get('/api/v1/dashboard/metrics')).data
  })

  const cards = [
    { label: 'Leads', value: data?.leads ?? 0, color: 'blue' },
    { label: 'Active Members', value: data?.active_members ?? 0, color: 'teal' },
    { label: 'Revenue', value: `₹${(data?.monthly_revenue ?? 0).toLocaleString()}`, color: 'violet' },
    { label: 'ROI', value: `${data?.roi ?? 0}x`, color: 'orange' }
  ]

  const leadTrend = [
    { day: 'Mon', leads: 4 },
    { day: 'Tue', leads: 7 },
    { day: 'Wed', leads: 8 },
    { day: 'Thu', leads: 6 },
    { day: 'Fri', leads: 9 },
    { day: 'Sat', leads: 5 },
    { day: 'Sun', leads: 3 }
  ]

  const conversionFunnel = [
    { stage: 'Visitors', value: 1200 },
    { stage: 'Leads', value: 210 },
    { stage: 'Trials', value: 74 },
    { stage: 'Members', value: data?.active_members ?? 0 }
  ]

  const totalCapacity = data?.capacity ?? 200
  const occupancy = Math.min(100, Math.round(((data?.active_members ?? 0) / totalCapacity) * 100))

  return (
    <>
      <Group justify="space-between" mb="md">
        <Title order={3}>Dashboard</Title>
        <Text c="dimmed" size="sm">Performance snapshot</Text>
      </Group>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
        {cards.map(({ label, value, color }) => (
          <Card key={label} withBorder radius="md">
            <Group justify="space-between">
              <Text c="dimmed">{label}</Text>
              <ThemeIcon color={color} variant="light" radius="xl" />
            </Group>
            <Text fw={800} size="xl" mt={8}>{String(value)}</Text>
          </Card>
        ))}
      </SimpleGrid>

      <Grid mt="md">
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Card withBorder radius="md" h={340}>
            <Title order={5} mb="sm">Weekly Lead Trend</Title>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={leadTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="leads" stroke="#228be6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Stack h="100%">
            <Card withBorder radius="md">
              <Title order={5} mb="sm">Membership Occupancy</Title>
              <Text c="dimmed" size="xs">Capacity: {totalCapacity}</Text>
              <Group justify="center" mt="sm">
                <RingProgress
                  size={140}
                  thickness={14}
                  roundCaps
                  sections={[{ value: occupancy, color: 'teal' }]}
                  label={<Text fw={700} ta="center">{occupancy}%</Text>}
                />
              </Group>
            </Card>
            <Card withBorder radius="md">
              <Title order={5} mb="sm">Conversion Funnel</Title>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={conversionFunnel} layout="vertical" margin={{ left: 16 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="stage" type="category" width={70} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#15aabf" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </>
  )
}
