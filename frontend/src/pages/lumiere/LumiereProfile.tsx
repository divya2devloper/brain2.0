import { useState } from 'react'
import { Text, Title } from '@mantine/core'

type ViewMode = 'studio' | 'freelancer'
type AuthLevel = 'manager' | 'staff'

const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const MailIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2,4 12,13 22,4" />
  </svg>
)

const PhoneIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const MedalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="15" r="5" />
    <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32" />
  </svg>
)

const BoxIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="21 8 21 21 3 21 3 8" />
    <rect x="1" y="3" width="22" height="5" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </svg>
)

const LocationPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1dbde6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
)

const TimerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const skills = ['Wedding Photography', 'Drone Videography', 'Portrait Sessions', 'Event Coverage']
const equipment = ['Canon EOS R5', 'DJI Mavic 3 Pro', 'Sony A7IV', 'Godox Lighting Kit']

const branches = [
  { city: 'Mumbai', address: 'Bandra West, Linking Road' },
  { city: 'Bengaluru', address: 'Indiranagar, 100ft Road' },
  { city: 'Goa', address: 'Calangute (Seasonal)' },
]

export function LumiereProfile() {
  const [viewMode, setViewMode] = useState<ViewMode>('freelancer')
  const [authLevel, setAuthLevel] = useState<AuthLevel>('manager')

  const isFreelancer = viewMode === 'freelancer'

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Title order={2} fw={700} style={{ color: '#1a1a2e' }}>
          {isFreelancer ? 'Freelancer Profile' : 'Studio Profile'}
        </Title>
        <Text c="dimmed" size="sm" mt={2}>Manage your identity and authority settings.</Text>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
        {/* Left: Main profile card */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8ecf0', padding: '24px 26px' }}>
          {/* Studio header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, paddingBottom: 20, borderBottom: '1px solid #f0f4f8' }}>
            <div style={{
              width: 72, height: 72, borderRadius: 16, flexShrink: 0,
              background: 'linear-gradient(135deg, #ff8c00 0%, #ffc107 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 18, color: '#1a1a2e' }}>Lumière Studios</span>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 2 }}>
                  <EditIcon />
                </button>
              </div>
              <p style={{ margin: '0 0 10px', fontSize: 14, color: '#555', lineHeight: 1.5 }}>
                Award-winning wedding &amp; cinematic photography across India. Featured in WedMeGood, Brides Today.
              </p>
              <div style={{ display: 'flex', gap: 18, fontSize: 13, color: '#666' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <MailIcon /> studio@lumiere.in
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <PhoneIcon /> +91 98765 43210
                </span>
              </div>
            </div>
          </div>

          {/* Content based on view mode */}
          {isFreelancer ? (
            <>
              {/* Skills & Expertise */}
              <div style={{ paddingTop: 20, paddingBottom: 20, borderBottom: '1px solid #f0f4f8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <MedalIcon />
                  <span style={{ fontWeight: 600, fontSize: 15, color: '#1a1a2e' }}>Skills &amp; Expertise</span>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {skills.map(s => (
                    <span key={s} style={{
                      background: '#f5e6ff',
                      color: '#9333ea',
                      border: '1px solid #e8c8ff',
                      borderRadius: 20,
                      padding: '5px 14px',
                      fontSize: 13,
                      fontWeight: 500,
                    }}>{s}</span>
                  ))}
                </div>
              </div>

              {/* Equipment */}
              <div style={{ paddingTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <BoxIcon />
                  <span style={{ fontWeight: 600, fontSize: 15, color: '#1a1a2e' }}>Equipment</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {equipment.map(e => (
                    <div key={e} style={{
                      background: '#fff8f0',
                      border: '1px solid #ffe8cc',
                      borderRadius: 8,
                      padding: '10px 14px',
                      fontSize: 14,
                      color: '#333',
                    }}>{e}</div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Branch Locations */}
              <div style={{ paddingTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <LocationPinIcon />
                  <span style={{ fontWeight: 600, fontSize: 15, color: '#1a1a2e' }}>Branch Locations</span>
                </div>
                {branches.map((b, i) => (
                  <div key={b.city} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 0',
                    borderBottom: i < branches.length - 1 ? '1px solid #f0f4f8' : 'none',
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e', marginBottom: 3 }}>{b.city}</div>
                      <div style={{ fontSize: 13, color: '#666' }}>{b.address}</div>
                    </div>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 4 }}>
                      <EditIcon />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right: Identity & Authority + Trial Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Identity & Authority */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8ecf0', padding: '20px 22px' }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e', marginBottom: 16 }}>Identity &amp; Authority</div>

            {/* View Mode */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 8, fontWeight: 500 }}>View Mode</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setViewMode('studio')}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: 8, border: '1px solid #e8ecf0',
                    cursor: 'pointer', fontSize: 13, fontWeight: viewMode === 'studio' ? 700 : 400,
                    background: viewMode === 'studio' ? 'linear-gradient(90deg, #1dbde6, #4a9eff)' : '#fff',
                    color: viewMode === 'studio' ? '#fff' : '#555',
                  }}
                >Studio Owner</button>
                <button
                  onClick={() => setViewMode('freelancer')}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: 8, border: '1px solid #e8ecf0',
                    cursor: 'pointer', fontSize: 13, fontWeight: viewMode === 'freelancer' ? 700 : 400,
                    background: viewMode === 'freelancer' ? 'linear-gradient(90deg, #1dbde6, #4a9eff)' : '#fff',
                    color: viewMode === 'freelancer' ? '#fff' : '#555',
                  }}
                >Freelancer</button>
              </div>
            </div>

            {/* Authority Level */}
            <div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 8, fontWeight: 500 }}>Authority Level</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setAuthLevel('manager')}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: 8, border: '1px solid #e8ecf0',
                    cursor: 'pointer', fontSize: 13, fontWeight: authLevel === 'manager' ? 700 : 400,
                    background: authLevel === 'manager' ? 'linear-gradient(90deg, #e040fb, #c0392b)' : '#fff',
                    color: authLevel === 'manager' ? '#fff' : '#555',
                  }}
                >Manager</button>
                <button
                  onClick={() => setAuthLevel('staff')}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: 8, border: '1px solid #e8ecf0',
                    cursor: 'pointer', fontSize: 13, fontWeight: authLevel === 'staff' ? 700 : 400,
                    background: authLevel === 'staff' ? 'linear-gradient(90deg, #e040fb, #c0392b)' : '#fff',
                    color: authLevel === 'staff' ? '#fff' : '#555',
                  }}
                >Staff</button>
              </div>
            </div>
          </div>

          {/* Trial Status */}
          <div style={{ background: '#fffbec', borderRadius: 14, border: '1px solid #ffe8a0', padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <TimerIcon />
              <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>Trial Status</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#e87f00', marginBottom: 4 }}>72h 0m</div>
            <div style={{ fontSize: 13, color: '#888' }}>Full access remaining</div>
          </div>
        </div>
      </div>
    </>
  )
}
