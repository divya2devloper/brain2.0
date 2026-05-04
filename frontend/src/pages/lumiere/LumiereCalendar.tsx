import { useState } from 'react'
import { useLumiere } from './LumiereContext'

type DateStatus = 'available' | 'busy' | 'blocked'

const ROLE_COLORS: Record<string, string> = {
  Candid: '#ff8c00',
  Drone: '#3b82f6',
  Traditional: '#ec4899',
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

function dateKey(year: number, month: number, day: number) {
  return `${year}-${month}-${day}`
}

function fmtDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function LumiereCalendar() {
  const { jobs } = useLumiere()
  const [year, setYear] = useState(2026)
  const [month, setMonth] = useState(4) // May (0-indexed)
  const [overrides, setOverrides] = useState<Record<string, DateStatus>>({})

  const firstDay = new Date(year, month, 1).getDay()
  const totalDays = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= totalDays; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  function getStatus(day: number): DateStatus {
    const k = dateKey(year, month, day)
    if (overrides[k]) return overrides[k]
    const iso = fmtDate(year, month, day)
    return jobs.some(j => j.date === iso) ? 'busy' : 'available'
  }

  function cycleStatus(day: number) {
    const k = dateKey(year, month, day)
    const cur = getStatus(day)
    const next: DateStatus = cur === 'available' ? 'busy' : cur === 'busy' ? 'blocked' : 'available'
    setOverrides(p => ({ ...p, [k]: next }))
  }

  function getRoleDots(day: number): string[] {
    const iso = fmtDate(year, month, day)
    const seen = new Set<string>()
    for (const job of jobs) {
      if (job.date !== iso) continue
      for (const slot of job.roles) {
        seen.add(slot.category)
      }
    }
    return Array.from(seen)
  }

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  const isToday = (day: number) => year === 2026 && month === 4 && day === 4

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: 26, color: '#1a1a2e' }}>Studio Calendar</h2>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: '#888' }}>Track your shoots and manage availability.</p>
        </div>
        {/* Month navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={prevMonth} style={{
            width: 32, height: 32, borderRadius: 8,
            border: '1px solid #e8ecf0', background: '#fff',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, color: '#55556e',
          }}>‹</button>
          <span style={{ fontWeight: 600, fontSize: 15, color: '#1a1a2e', minWidth: 110, textAlign: 'center' }}>
            {MONTH_NAMES[month]} {year}
          </span>
          <button onClick={nextMonth} style={{
            width: 32, height: 32, borderRadius: 8,
            border: '1px solid #e8ecf0', background: '#fff',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, color: '#55556e',
          }}>›</button>
        </div>
      </div>

      {/* Body: calendar + right panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 20 }}>

        {/* Calendar grid */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8ecf0', padding: '20px 24px' }}>
          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
            {DOW.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#888', paddingBottom: 6 }}>{d}</div>
            ))}
          </div>
          {/* Date cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {cells.map((day, i) => {
              if (!day) return <div key={i} style={{ minHeight: 72 }} />
              const status = getStatus(day)
              const dots = getRoleDots(day)
              const today = isToday(day)

              let bg = '#fff'
              let border = '1px solid #e8ecf0'
              if (status === 'busy') { bg = '#fffde7'; border = '2px solid #ffd700' }
              if (status === 'blocked') { bg = '#fff0f3'; border = '2px solid #ffb3c1' }

              return (
                <div
                  key={i}
                  onClick={() => cycleStatus(day)}
                  title={`Click to toggle status (${status})`}
                  style={{
                    minHeight: 72, borderRadius: 8, background: bg, border,
                    padding: '6px 8px', cursor: 'pointer',
                    transition: 'box-shadow 0.15s',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: today ? 700 : 400, color: today ? '#1dbde6' : '#333' }}>
                    {day}
                  </span>
                  {dots.length > 0 && (
                    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', paddingBottom: 2 }}>
                      {dots.map(r => (
                        <div key={r} style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: ROLE_COLORS[r] ?? '#888',
                          flexShrink: 0,
                        }} />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Role Legend */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8ecf0', padding: '18px 20px' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e', marginBottom: 14 }}>Role Legend</div>
            {Object.entries(ROLE_COLORS).map(([role, color]) => (
              <div key={role} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#333' }}>{role}</span>
              </div>
            ))}
          </div>

          {/* Date Status */}
          <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8ecf0', padding: '18px 20px' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e', marginBottom: 14 }}>Date Status</div>
            {[
              { label: 'Available', bg: '#fff', border: '1px solid #e8ecf0' },
              { label: 'Busy', bg: '#fffde7', border: '2px solid #ffd700' },
              { label: 'Blocked', bg: '#fff0f3', border: '2px solid #ffb3c1' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 22, height: 16, borderRadius: 4,
                  background: s.bg, border: s.border, flexShrink: 0,
                }} />
                <span style={{ fontSize: 13, color: '#333' }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Quick Tip */}
          <div style={{
            background: 'linear-gradient(135deg, #1dbde6 0%, #00bfa5 100%)',
            borderRadius: 14, padding: '18px 20px',
          }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 8 }}>💡 Quick Tip</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.92)', lineHeight: 1.5 }}>
              Click on any date to toggle between Available, Busy, and Blocked status.
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
