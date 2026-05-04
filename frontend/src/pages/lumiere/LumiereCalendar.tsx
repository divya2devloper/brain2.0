import { Card, Text, Title } from '@mantine/core'

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const events: Record<number, { title: string; color: string }[]> = {
  5: [{ title: 'Mehta Anniversary – Taj Hotel, Bangalore', color: '#1dbde6' }],
  15: [{ title: 'Sharma Wedding – The Grand Palace, Mumbai', color: '#a855f7' }],
  20: [{ title: 'Patel Engagement – ITC Windsor, Chennai', color: '#ff8c00' }],
}

export function LumiereCalendar() {
  const year = 2026
  const month = 4 // May (0-indexed)
  const monthName = 'May 2026'
  const firstDay = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= totalDays; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <Title order={2} fw={700} style={{ color: '#1a1a2e' }}>Calendar</Title>
        <Text c="dimmed" size="sm" mt={2}>Upcoming shoots and events.</Text>
      </div>

      <Card withBorder radius="md" p="lg">
        <Title order={4} mb="lg" style={{ color: '#1a1a2e' }}>{monthName}</Title>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {daysOfWeek.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#888', paddingBottom: 8 }}>{d}</div>
          ))}
          {cells.map((day, i) => {
            const ev = day ? events[day] : undefined
            return (
              <div key={i} style={{
                minHeight: 72,
                borderRadius: 8,
                background: day ? '#fff' : 'transparent',
                border: day ? '1px solid #f0f4f8' : 'none',
                padding: day ? '6px 8px' : 0,
                position: 'relative',
              }}>
                {day && (
                  <>
                    <Text size="xs" fw={day === 4 ? 700 : 400} style={{ color: day === 4 ? '#1dbde6' : '#444' }}>{day}</Text>
                    {ev?.map((e, ei) => (
                      <div key={ei} style={{
                        marginTop: 4,
                        background: e.color,
                        borderRadius: 4,
                        padding: '2px 5px',
                        fontSize: 10,
                        color: '#fff',
                        lineHeight: 1.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>{e.title}</div>
                    ))}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </Card>
    </>
  )
}
