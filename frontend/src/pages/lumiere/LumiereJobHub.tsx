import { useState } from 'react'
import { Text, Title } from '@mantine/core'

type JobStatus = 'Assigned' | 'Open' | 'Completed'

interface RoleAssignment {
  role: string
  status: JobStatus
}

interface Job {
  id: number
  name: string
  date: string
  location: string
  price: string
  roles: RoleAssignment[]
}

const ALL_JOBS: Job[] = [
  {
    id: 1,
    name: 'Sharma Wedding',
    date: '2026-05-15',
    location: 'The Grand Palace, Mumbai',
    price: '₹1,25,000',
    roles: [
      { role: 'Candid', status: 'Assigned' },
      { role: 'Drone', status: 'Assigned' },
      { role: 'Traditional', status: 'Open' },
    ],
  },
  {
    id: 2,
    name: 'Mehta Anniversary',
    date: '2026-05-08',
    location: 'Taj Hotel, Bangalore',
    price: '₹85,000',
    roles: [
      { role: 'Candid', status: 'Assigned' },
      { role: 'Traditional', status: 'Assigned' },
    ],
  },
  {
    id: 3,
    name: 'Kumar Reception',
    date: '2026-04-22',
    location: 'Leela Palace, Goa',
    price: '₹1,50,000',
    roles: [
      { role: 'Candid', status: 'Completed' },
      { role: 'Drone', status: 'Completed' },
      { role: 'Traditional', status: 'Completed' },
    ],
  },
  {
    id: 4,
    name: 'Patel Engagement',
    date: '2026-05-20',
    location: 'ITC Windsor, Chennai',
    price: '₹65,000',
    roles: [
      { role: 'Candid', status: 'Assigned' },
      { role: 'Drone', status: 'Open' },
    ],
  },
  {
    id: 5,
    name: 'Reddy Wedding',
    date: '2026-04-18',
    location: 'Ramada Plaza, Hyderabad',
    price: '₹95,000',
    roles: [
      { role: 'Candid', status: 'Completed' },
      { role: 'Traditional', status: 'Completed' },
    ],
  },
]

const TODAY = new Date('2026-05-04')

function classifyJob(job: Job): 'past' | 'current' | 'future' {
  const d = new Date(job.date)
  const diff = (d.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24)
  if (diff < -1) return 'past'
  if (diff > 7) return 'future'
  return 'current'
}

const statusStyle: Record<JobStatus, { bg: string; color: string }> = {
  Assigned: { bg: '#e6fff5', color: '#00a86b' },
  Open: { bg: '#fff8e6', color: '#f59e0b' },
  Completed: { bg: '#e8fff0', color: '#22c55e' },
}

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const LocationIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
)

const PersonIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
)

type Filter = 'all' | 'past' | 'current' | 'future'

export function LumiereJobHub() {
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = ALL_JOBS.filter(j => {
    if (filter === 'all') return true
    return classifyJob(j) === filter
  })

  const tabs: { id: Filter; label: string }[] = [
    { id: 'all', label: 'All Jobs' },
    { id: 'past', label: 'Past' },
    { id: 'current', label: 'Current' },
    { id: 'future', label: 'Future' },
  ]

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Title order={2} fw={700} style={{ color: '#1a1a2e' }}>Job Hub</Title>
        <Text c="dimmed" size="sm" mt={2}>Manage all your photography projects in one place.</Text>
      </div>

      {/* Filter tabs */}
      <div style={{
        display: 'inline-flex',
        gap: 4,
        background: '#fff',
        border: '1px solid #e8ecf0',
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
      }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            style={{
              border: 'none',
              cursor: 'pointer',
              padding: '7px 18px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: filter === t.id ? 600 : 400,
              background: filter === t.id ? 'linear-gradient(90deg, #1dbde6 0%, #4a9eff 100%)' : 'transparent',
              color: filter === t.id ? '#fff' : '#55556e',
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Job grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: 16 }}>
        {filtered.map(job => (
          <div key={job.id} style={{
            background: '#fff',
            borderRadius: 14,
            border: '1px solid #e8ecf0',
            padding: '20px 22px',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a2e' }}>{job.name}</div>
                <div style={{ display: 'flex', gap: 12, marginTop: 5, color: '#666', fontSize: 13 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <CalendarIcon /> {job.date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <LocationIcon /> {job.location}
                  </span>
                </div>
              </div>
              <span style={{
                background: '#00a86b',
                color: '#fff',
                fontWeight: 700,
                fontSize: 13,
                borderRadius: 8,
                padding: '5px 12px',
                whiteSpace: 'nowrap',
              }}>{job.price}</span>
            </div>

            {/* Divider */}
            <div style={{ borderTop: '1px solid #f0f4f8', margin: '14px 0' }} />

            {/* Role Assignments */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10, color: '#555', fontSize: 13 }}>
                <PersonIcon />
                <span style={{ fontWeight: 500 }}>Role Assignments</span>
              </div>
              {job.roles.map(r => (
                <div key={r.role} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '6px 0',
                  borderBottom: '1px solid #f8f9fa',
                  fontSize: 14,
                  color: '#333',
                }}>
                  <span>{r.role}</span>
                  <span style={{
                    ...statusStyle[r.status],
                    borderRadius: 6,
                    padding: '3px 10px',
                    fontSize: 12,
                    fontWeight: 500,
                  }}>{r.status}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ color: '#888', fontSize: 14, padding: 20 }}>No jobs found for this filter.</div>
        )}
      </div>
    </>
  )
}
