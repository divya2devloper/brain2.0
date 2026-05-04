import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { LumiereProvider, useLumiere, FREELANCER_DB, MY_MOBILE } from '../pages/lumiere/LumiereContext'

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)
const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)
const JobHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
)
const AnalyticsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)
const ProfileIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
)
const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const navItems = [
  { label: 'Dashboard', to: '/lumiere/dashboard', Icon: DashboardIcon },
  { label: 'Calendar', to: '/lumiere/calendar', Icon: CalendarIcon },
  { label: 'Job Hub', to: '/lumiere/job-hub', Icon: JobHubIcon },
  { label: 'Analytics', to: '/lumiere/analytics', Icon: AnalyticsIcon },
  { label: 'Profile', to: '/lumiere/profile', Icon: ProfileIcon },
]

function NotificationPanel() {
  const { notifs, markAllRead } = useLumiere()
  const [open, setOpen] = useState(false)
  const unread = notifs.filter(n => !n.read).length

  function toggle() {
    if (!open) markAllRead()
    setOpen(p => !p)
  }

  return (
    <div style={{ position: 'fixed', top: 16, right: 20, zIndex: 300 }}>
      <button
        onClick={toggle}
        title="Notifications"
        style={{
          width: 40, height: 40, borderRadius: '50%',
          background: '#fff', border: '1px solid #e8ecf0',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          color: '#55556e',
        }}
      >
        <BellIcon />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: -3, right: -3,
            background: '#ef4444', color: '#fff',
            borderRadius: '50%', width: 18, height: 18,
            fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #fff',
          }}>{unread > 9 ? '9+' : unread}</span>
        )}
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: -1 }}
          />
          <div style={{
            position: 'absolute', top: 46, right: 0, width: 320,
            background: '#fff', borderRadius: 12, border: '1px solid #e8ecf0',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)', overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 16px', borderBottom: '1px solid #f0f4f8',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>Notifications</span>
              <button
                onClick={markAllRead}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#1dbde6' }}
              >Mark all read</button>
            </div>
            {notifs.slice(0, 8).map(n => (
              <div key={n.id} style={{
                padding: '12px 16px', borderBottom: '1px solid #f8f9fa',
                background: n.read ? '#fff' : '#f0f9ff',
                display: 'flex', gap: 10, alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: n.read ? '#d1d5db' : '#1dbde6',
                  marginTop: 5, flexShrink: 0,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: '#1a1a2e', lineHeight: 1.4 }}>{n.text}</div>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 3 }}>{n.time}</div>
                </div>
              </div>
            ))}
            {notifs.length === 0 && (
              <div style={{ padding: '24px 16px', textAlign: 'center', fontSize: 13, color: '#888' }}>
                No notifications
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function SidebarFooter() {
  const { viewMode } = useLumiere()
  const isFreelancer = viewMode === 'freelancer'
  const freelancer = FREELANCER_DB[MY_MOBILE]
  const name = isFreelancer ? freelancer.name : 'Lumière Studios'
  const role = isFreelancer ? 'Freelancer' : 'Studio Owner'
  const initial = name.charAt(0).toUpperCase()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 8px 10px', borderTop: '1px solid #f0f4f8' }}>
      <div style={{
        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
        background: isFreelancer
          ? 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)'
          : 'linear-gradient(135deg, #ff8c00 0%, #ffc107 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 700, fontSize: 14,
      }}>{initial}</div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 13, color: '#1a1a2e', lineHeight: 1.2 }}>{name}</div>
        <div style={{ fontSize: 11, color: '#888899' }}>{role}</div>
      </div>
    </div>
  )
}

function LayoutShell() {
  const location = useLocation()
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4f8', fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, minHeight: '100vh', background: '#ffffff',
        display: 'flex', flexDirection: 'column',
        padding: '24px 12px 20px',
        boxShadow: '1px 0 0 #e8ecf0',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 8, marginBottom: 28 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #1dbde6 0%, #4a9eff 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 15, flexShrink: 0,
          }}>L</div>
          <span style={{ fontWeight: 700, fontSize: 17, color: '#1a1a2e', letterSpacing: '-0.3px' }}>Lumière</span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1 }}>
          {navItems.map(({ label, to, Icon }) => {
            const isActive = location.pathname === to || location.pathname.startsWith(to + '/')
            return (
              <Link key={to} to={to} style={{ textDecoration: 'none', display: 'block', marginBottom: 2 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '9px 14px', borderRadius: 10,
                  background: isActive ? 'linear-gradient(90deg, #1dbde6 0%, #4a9eff 100%)' : 'transparent',
                  color: isActive ? '#ffffff' : '#55556e',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: 14, transition: 'background 0.15s',
                }}>
                  <Icon />{label}
                </div>
              </Link>
            )
          })}
        </nav>

        <SidebarFooter />
      </aside>

      {/* Notification Bell (top-right) */}
      <NotificationPanel />

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: 220, padding: '32px 36px', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  )
}

export function LumiereLayout() {
  return (
    <LumiereProvider>
      <LayoutShell />
    </LumiereProvider>
  )
}
