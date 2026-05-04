import { useLumiere, MY_MOBILE, FREELANCER_DB, type SlotStatus } from './LumiereContext'
import { Card, Grid, SimpleGrid, Text, Title } from '@mantine/core'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useState } from 'react'

const monthlyData = [
  { month: 'Jan', bookings: 85 }, { month: 'Feb', bookings: 92 }, { month: 'Mar', bookings: 105 },
  { month: 'Apr', bookings: 98 }, { month: 'May', bookings: 112 }, { month: 'Jun', bookings: 125 },
  { month: 'Jul', bookings: 118 }, { month: 'Aug', bookings: 132 }, { month: 'Sep', bookings: 145 },
  { month: 'Oct', bookings: 138 }, { month: 'Nov', bookings: 152 }, { month: 'Dec', bookings: 165 },
]
const revenueData = [
  { category: 'Candid', revenue: 562500 },
  { category: 'Drone', revenue: 375000 },
  { category: 'Traditional', revenue: 312500 },
]

const statusStyles: Record<SlotStatus, { bg: string; color: string }> = {
  Open:      { bg: '#fff8e6', color: '#f59e0b' },
  Pending:   { bg: '#eff6ff', color: '#3b82f6' },
  Assigned:  { bg: '#ecfdf5', color: '#059669' },
  Completed: { bg: '#f0fdf4', color: '#16a34a' },
}

/* ─── Freelancer Dashboard ─────────────────────────────────────── */
function FreelancerDashboard() {
  const { jobs, updateJob, pushNotif } = useLumiere()
  const [rateFor, setRateFor] = useState<string | null>(null)
  const [rateInput, setRateInput] = useState('')

  const myJobs = jobs.filter(j => j.roles.some(r => r.freelancerMobile === MY_MOBILE))
  const pendingSlots = myJobs.flatMap(j =>
    j.roles
      .filter(r => r.freelancerMobile === MY_MOBILE && r.status === 'Pending')
      .map(r => ({ job: j, slot: r }))
  )
  const upcomingSlots = myJobs.flatMap(j =>
    j.roles
      .filter(r => r.freelancerMobile === MY_MOBILE && r.status === 'Assigned')
      .map(r => ({ job: j, slot: r }))
  ).sort((a, b) => a.job.date.localeCompare(b.job.date)).slice(0, 5)

  const fl = FREELANCER_DB[MY_MOBILE]

  function accept(jobId: number, slotId: string, jobName: string, cat: string) {
    const rate = parseInt(rateInput.replace(/[^\d]/g, ''), 10) || undefined
    const job = jobs.find(j => j.id === jobId)!
    updateJob({ ...job, roles: job.roles.map(r => r.id === slotId ? { ...r, status: 'Assigned' as SlotStatus, agreedRate: rate } : r) })
    pushNotif(`You accepted "${jobName}" – ${cat}${rate ? ` at ₹${rate.toLocaleString('en-IN')}` : ''}`)
    setRateFor(null); setRateInput('')
  }

  function decline(jobId: number, slotId: string, jobName: string, cat: string) {
    const job = jobs.find(j => j.id === jobId)!
    updateJob({ ...job, roles: job.roles.map(r => r.id === slotId ? { ...r, status: 'Open' as SlotStatus, freelancerMobile: undefined } : r) })
    pushNotif(`You declined "${jobName}" – ${cat}`)
  }

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <Title order={2} fw={700} style={{ color: '#1a1a2e' }}>Hey, {fl.name}! 👋</Title>
        <Text c="dimmed" size="sm" mt={2}>Here's your activity overview.</Text>
      </div>

      {/* Stats */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} mb="lg">
        {[
          { label: 'Assigned Shoots', value: String(upcomingSlots.length), gradient: 'linear-gradient(135deg, #1dbde6, #4a9eff)' },
          { label: 'Pending Requests', value: String(pendingSlots.length), gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
          { label: 'Completed Jobs', value: String(myJobs.filter(j => j.roles.filter(r => r.freelancerMobile === MY_MOBILE).every(r => r.status === 'Completed')).length), gradient: 'linear-gradient(135deg, #059669, #10b981)' },
        ].map(s => (
          <div key={s.label} style={{ background: s.gradient, borderRadius: 14, padding: '20px 22px', color: '#fff' }}>
            <Text size="sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{s.label}</Text>
            <Text fw={800} size="xl" mt={6}>{s.value}</Text>
          </div>
        ))}
      </SimpleGrid>

      <Grid>
        {/* Pending Requests */}
        <Grid.Col span={{ base: 12, lg: 5 }}>
          <Card withBorder radius="md" p="lg">
            <Title order={5} mb="md" style={{ color: '#1a1a2e' }}>📬 Pending Job Requests</Title>
            {pendingSlots.length === 0 ? (
              <Text c="dimmed" size="sm">No pending requests right now.</Text>
            ) : (
              pendingSlots.map(({ job, slot }) => (
                <div key={`${job.id}-${slot.id}`} style={{ marginBottom: 14, padding: '12px 14px', background: '#f0f9ff', borderRadius: 10, border: '1px solid #bfdbfe' }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1e40af' }}>{job.name}</div>
                  <div style={{ fontSize: 12, color: '#555', margin: '3px 0 8px' }}>
                    {job.date} · {job.location} · <strong>{slot.category}</strong>
                  </div>
                  {rateFor === slot.id ? (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <input
                        value={rateInput} onChange={e => setRateInput(e.target.value)}
                        placeholder="Your rate ₹ (optional)"
                        style={{ flex: 1, padding: '6px 10px', borderRadius: 7, border: '1px solid #bfdbfe', fontSize: 12, minWidth: 120 }}
                      />
                      <button onClick={() => accept(job.id, slot.id, job.name, slot.category)}
                        style={{ padding: '6px 14px', borderRadius: 7, border: 'none', background: '#059669', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                        ✓ Confirm
                      </button>
                      <button onClick={() => setRateFor(null)}
                        style={{ padding: '6px 10px', borderRadius: 7, border: '1px solid #e8ecf0', background: '#fff', cursor: 'pointer', fontSize: 12 }}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => { setRateFor(slot.id); setRateInput('') }}
                        style={{ padding: '6px 14px', borderRadius: 7, border: 'none', background: '#059669', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                        ✓ Accept
                      </button>
                      <button onClick={() => decline(job.id, slot.id, job.name, slot.category)}
                        style={{ padding: '6px 14px', borderRadius: 7, border: '1px solid #fca5a5', background: '#fff', color: '#ef4444', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                        ✗ Decline
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </Card>
        </Grid.Col>

        {/* Upcoming shoots */}
        <Grid.Col span={{ base: 12, lg: 7 }}>
          <Card withBorder radius="md" p="lg">
            <Title order={5} mb="md" style={{ color: '#1a1a2e' }}>📅 Your Upcoming Shoots</Title>
            {upcomingSlots.length === 0 ? (
              <Text c="dimmed" size="sm">No upcoming shoots assigned yet.</Text>
            ) : (
              upcomingSlots.map(({ job, slot }) => (
                <div key={`${job.id}-${slot.id}`} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 0', borderBottom: '1px solid #f0f4f8', fontSize: 14,
                }}>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1a1a2e' }}>{job.name}</div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{job.date} · {job.location}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#555' }}>{slot.category}</span>
                    <span style={{ ...statusStyles[slot.status], borderRadius: 6, padding: '3px 9px', fontSize: 12, fontWeight: 500 }}>
                      {slot.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  )
}

/* ─── Studio Owner Dashboard ───────────────────────────────────── */
function StudioDashboard() {
  const { jobs, authLevel } = useLumiere()
  const showRevenue = authLevel === 'manager'
  const activeJobs = jobs.filter(j => j.roles.some(r => r.status === 'Open' || r.status === 'Assigned'))
  const openRoles = jobs.flatMap(j => j.roles).filter(r => r.status === 'Open').length
  const totalRevenue = jobs.reduce((s, j) => s + j.price, 0)

  const statsRow = [
    { label: 'Active Jobs', value: String(activeJobs.length), gradient: 'linear-gradient(135deg, #1dbde6 0%, #4a9eff 100%)' },
    { label: 'Open Roles', value: String(openRoles), gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' },
    { label: 'Total Bookings', value: '1,248', gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' },
    ...(showRevenue ? [{ label: 'Total Revenue', value: `₹${(totalRevenue / 100000).toFixed(1)}L`, gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)' }] : []),
  ]

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Title order={2} fw={700} style={{ color: '#1a1a2e' }}>Dashboard</Title>
        <Text c="dimmed" size="sm" mt={2}>Welcome back, Lumière Studios</Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: statsRow.length }} mb="lg">
        {statsRow.map(({ label, value, gradient }) => (
          <div key={label} style={{ background: gradient, borderRadius: 14, padding: '20px 22px', color: '#fff' }}>
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
            <Title order={5} mb="md" style={{ color: '#1a1a2e' }}>
              {showRevenue ? 'Revenue by Category' : 'Bookings by Category'}
            </Title>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={revenueData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="category" type="category" width={70} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => showRevenue ? `₹${(Number(v) / 100000).toFixed(1)}L` : String(v)} />
                <Bar dataKey="revenue" fill="#1dbde6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Upcoming jobs */}
      <Card withBorder radius="md" p="lg" mt="md">
        <Title order={5} mb="md" style={{ color: '#1a1a2e' }}>Upcoming Jobs</Title>
        {jobs
          .filter(j => new Date(j.date) >= new Date('2026-05-04'))
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(0, 4)
          .map(j => (
            <div key={j.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: '1px solid #f0f4f8', fontSize: 14,
            }}>
              <div>
                <span style={{ fontWeight: 600, color: '#1a1a2e' }}>{j.name}</span>
                <span style={{ fontSize: 12, color: '#888', marginLeft: 10 }}>{j.location}</span>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#555' }}>{j.date}</span>
                {showRevenue && (
                  <span style={{ fontWeight: 600, fontSize: 13, color: '#059669' }}>
                    ₹{j.price.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>
          ))}
      </Card>
    </>
  )
}

/* ─── Exported component ─────────────────────────────────────────── */
export function LumiereDashboard() {
  const { viewMode } = useLumiere()
  return viewMode === 'freelancer' ? <FreelancerDashboard /> : <StudioDashboard />
}
