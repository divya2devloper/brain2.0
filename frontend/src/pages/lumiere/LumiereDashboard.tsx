import { Card, Grid, Group, SimpleGrid, Text, Title } from '@mantine/core'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const monthlyData = [
  { month: 'Jan', bookings: 85 },
  { month: 'Feb', bookings: 92 },
  { month: 'Mar', bookings: 105 },
  { month: 'Apr', bookings: 98 },
  { month: 'May', bookings: 112 },
  { month: 'Jun', bookings: 125 },
  { month: 'Jul', bookings: 118 },
  { month: 'Aug', bookings: 132 },
  { month: 'Sep', bookings: 145 },
  { month: 'Oct', bookings: 138 },
  { month: 'Nov', bookings: 152 },
  { month: 'Dec', bookings: 165 },
]

const revenueData = [
  { category: 'Candid', revenue: 562500 },
  { category: 'Drone', revenue: 375000 },
  { category: 'Traditional', revenue: 312500 },
]

const stats = [
  { label: 'Total Bookings', value: '1,248', gradient: 'linear-gradient(135deg, #1dbde6 0%, #4a9eff 100%)' },
  { label: 'Active Projects', value: '24', gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' },
  { label: 'Total Revenue', value: '₹12.5L', gradient: 'linear-gradient(135deg, #00c853 0%, #00bfa5 100%)' },
  { label: 'Avg. Per Booking', value: '₹10,020', gradient: 'linear-gradient(135deg, #ff8c00 0%, #ffc107 100%)' },
]

export function LumiereDashboard() {
  return (
    <>
      <Group justify="space-between" mb="md">
        <div>
          <Title order={2} fw={700} style={{ color: '#1a1a2e' }}>Dashboard</Title>
          <Text c="dimmed" size="sm" mt={2}>Welcome back, Lumière Studios</Text>
        </div>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} mb="lg">
        {stats.map(({ label, value, gradient }) => (
          <div key={label} style={{
            background: gradient,
            borderRadius: 14,
            padding: '20px 22px',
            color: '#fff',
          }}>
            <Text size="sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{label}</Text>
            <Text fw={800} size="xl" mt={6}>{value}</Text>
          </div>
        ))}
      </SimpleGrid>

      <Grid>
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Card withBorder radius="md" p="lg">
            <Title order={5} mb="md" style={{ color: '#1a1a2e' }}>Booking Trends (12M)</Title>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#1dbde6" strokeWidth={2.5} dot={{ fill: '#1dbde6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Card withBorder radius="md" p="lg" h="100%">
            <Title order={5} mb="md" style={{ color: '#1a1a2e' }}>Revenue by Category</Title>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenueData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="category" type="category" width={70} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => `₹${(Number(v) / 100000).toFixed(1)}L`} />
                <Bar dataKey="revenue" fill="#1dbde6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid.Col>
      </Grid>
    </>
  )
}
