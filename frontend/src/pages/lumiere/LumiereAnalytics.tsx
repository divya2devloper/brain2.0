import { useState } from 'react'
import { Text, Title } from '@mantine/core'
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type Period = '1M' | '3M' | '6M' | '12M' | '2Y' | '3Y'

const bookingData: Record<Period, { label: string; value: number }[]> = {
  '1M': [
    { label: 'W1', value: 38 },
    { label: 'W2', value: 42 },
    { label: 'W3', value: 40 },
    { label: 'W4', value: 45 },
  ],
  '3M': [
    { label: 'Mar', value: 105 },
    { label: 'Apr', value: 98 },
    { label: 'May', value: 112 },
  ],
  '6M': [
    { label: 'Dec', value: 85 },
    { label: 'Jan', value: 92 },
    { label: 'Feb', value: 105 },
    { label: 'Mar', value: 98 },
    { label: 'Apr', value: 112 },
    { label: 'May', value: 125 },
  ],
  '12M': [
    { label: 'Jun', value: 85 },
    { label: 'Jul', value: 92 },
    { label: 'Aug', value: 105 },
    { label: 'Sep', value: 98 },
    { label: 'Oct', value: 112 },
    { label: 'Nov', value: 125 },
    { label: 'Dec', value: 118 },
    { label: 'Jan', value: 132 },
    { label: 'Feb', value: 145 },
    { label: 'Mar', value: 138 },
    { label: 'Apr', value: 152 },
    { label: 'May', value: 165 },
  ],
  '2Y': [
    { label: 'Q1 24', value: 240 },
    { label: 'Q2 24', value: 280 },
    { label: 'Q3 24', value: 310 },
    { label: 'Q4 24', value: 340 },
    { label: 'Q1 25', value: 290 },
    { label: 'Q2 25', value: 380 },
    { label: 'Q3 25', value: 420 },
    { label: 'Q4 25', value: 460 },
  ],
  '3Y': [
    { label: '2023 Q1', value: 180 },
    { label: '2023 Q3', value: 240 },
    { label: '2024 Q1', value: 280 },
    { label: '2024 Q3', value: 350 },
    { label: '2025 Q1', value: 390 },
    { label: '2025 Q3', value: 460 },
  ],
}

const revenueByRole = [
  { name: 'Candid', value: 45, color: '#ff8c00' },
  { name: 'Drone', value: 30, color: '#1a1a2e' },
  { name: 'Traditional', value: 25, color: '#e91e63' },
]

const PERIODS: Period[] = ['1M', '3M', '6M', '12M', '2Y', '3Y']

const TrendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1dbde6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

const DollarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const CustomDonutLabel = ({ viewBox }: { viewBox?: { cx: number; cy: number } }) => {
  const cx = viewBox?.cx ?? 0
  const cy = viewBox?.cy ?? 0
  return (
    <>
      <text x={cx} y={cy - 8} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 22, fontWeight: 700, fill: '#1a1a2e' }}>
        100%
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 12, fill: '#888' }}>
        Total
      </text>
    </>
  )
}

export function LumiereAnalytics() {
  const [period, setPeriod] = useState<Period>('12M')

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Title order={2} fw={700} style={{ color: '#1a1a2e' }}>Visual Analytics</Title>
        <Text c="dimmed" size="sm" mt={2}>Track your photography business performance over time.</Text>
      </div>

      {/* Period selector */}
      <div style={{
        display: 'inline-flex',
        gap: 4,
        background: '#fff',
        border: '1px solid #e8ecf0',
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
      }}>
        {PERIODS.map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            style={{
              border: 'none',
              cursor: 'pointer',
              padding: '7px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: period === p ? 700 : 400,
              background: period === p ? 'linear-gradient(90deg, #1dbde6 0%, #4a9eff 100%)' : 'transparent',
              color: period === p ? '#fff' : '#55556e',
              transition: 'all 0.15s',
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Booking Trends */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8ecf0', padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendIcon />
              <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>Booking Trends</span>
            </div>
            <span style={{ fontSize: 12, color: '#888' }}>{period} Period</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={bookingData[period]} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" name="Bookings" stroke="#1dbde6" strokeWidth={2.5} dot={{ fill: '#1dbde6', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Role */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #e8ecf0', padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <DollarIcon />
            <span style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>Revenue by Role</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={revenueByRole}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  labelLine={false}
                  label={<CustomDonutLabel />}
                >
                  {revenueByRole.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ width: '100%', marginTop: 8 }}>
              {revenueByRole.map(r => (
                <div key={r.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderBottom: '1px solid #f0f4f8', fontSize: 13 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                    <span style={{ color: '#333' }}>{r.name}</span>
                  </div>
                  <span style={{ fontWeight: 600, color: '#333' }}>{r.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div style={{ background: 'linear-gradient(135deg, #1dbde6 0%, #4a9eff 100%)', borderRadius: 14, padding: '22px 24px', color: '#fff' }}>
          <div style={{ fontSize: 13, opacity: 0.85 }}>Total Bookings</div>
          <div style={{ fontSize: 34, fontWeight: 800, marginTop: 6 }}>1,248</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)', borderRadius: 14, padding: '22px 24px', color: '#fff' }}>
          <div style={{ fontSize: 13, opacity: 0.85 }}>Active Projects</div>
          <div style={{ fontSize: 34, fontWeight: 800, marginTop: 6 }}>24</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #00c853 0%, #00bfa5 100%)', borderRadius: 14, padding: '22px 24px', color: '#fff' }}>
          <div style={{ fontSize: 13, opacity: 0.85 }}>Total Revenue</div>
          <div style={{ fontSize: 34, fontWeight: 800, marginTop: 6 }}>₹12.5L</div>
        </div>
      </div>
    </>
  )
}
