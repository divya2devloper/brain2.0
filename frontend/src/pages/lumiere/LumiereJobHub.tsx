import { useState } from 'react'
import {
  useLumiere, FREELANCER_DB, MY_MOBILE,
  type Job, type RoleSlot, type SlotStatus,
} from './LumiereContext'

/* ─── Icons ─────────────────────────────────────────────────────── */
const CalIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)
const LocIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" />
  </svg>
)
const PersonIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
)
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
  </svg>
)

/* ─── Types / Helpers ────────────────────────────────────────────── */
type Filter = 'all' | 'past' | 'current' | 'future'
const TODAY = new Date('2026-05-04')

function classify(date: string): 'past' | 'current' | 'future' {
  const diff = (new Date(date).getTime() - TODAY.getTime()) / 86400000
  if (diff < -1) return 'past'
  if (diff > 7) return 'future'
  return 'current'
}

const statusStyles: Record<SlotStatus, { bg: string; color: string }> = {
  Open:      { bg: '#fff8e6', color: '#f59e0b' },
  Pending:   { bg: '#eff6ff', color: '#3b82f6' },
  Assigned:  { bg: '#ecfdf5', color: '#059669' },
  Completed: { bg: '#f0fdf4', color: '#16a34a' },
}

function fmtPrice(n: number) {
  return '₹' + n.toLocaleString('en-IN')
}

/* ─── Edit / Create Modal ────────────────────────────────────────── */
interface ModalProps {
  job: Job | null      // null = create new
  onClose: () => void
}

function JobModal({ job: initJob, onClose }: ModalProps) {
  const { updateJob, addJob, newSlotId, newJobId, pushNotif } = useLumiere()
  const isNew = initJob === null

  const [name, setName] = useState(initJob?.name ?? '')
  const [date, setDate] = useState(initJob?.date ?? '')
  const [location, setLocation] = useState(initJob?.location ?? '')
  const [price, setPrice] = useState(String(initJob?.price ?? ''))
  const [roles, setRoles] = useState<RoleSlot[]>(initJob?.roles ? [...initJob.roles] : [])

  // "Assign" UX per-slot: mobile input + found name
  const [assignMobile, setAssignMobile] = useState<Record<string, string>>({})
  const [newCat, setNewCat] = useState('')

  function slotUpdate(id: string, patch: Partial<RoleSlot>) {
    setRoles(p => p.map(r => r.id === id ? { ...r, ...patch } : r))
  }

  function sendRequest(slotId: string) {
    const mobile = (assignMobile[slotId] ?? '').trim()
    if (!mobile) return
    const fl = FREELANCER_DB[mobile]
    if (!fl) { alert('Freelancer not found in registry. Check the mobile number.'); return }
    slotUpdate(slotId, { status: 'Pending', freelancerMobile: mobile })
    setAssignMobile(p => ({ ...p, [slotId]: '' }))
    pushNotif(`Request sent to ${fl.name} for "${name || initJob?.name}" – ${roles.find(r => r.id === slotId)?.category}`)
  }

  function assignDirect(slotId: string) {
    const mobile = (assignMobile[slotId] ?? '').trim()
    if (!mobile) return
    const fl = FREELANCER_DB[mobile]
    if (!fl) { alert('Freelancer not found.'); return }
    slotUpdate(slotId, { status: 'Assigned', freelancerMobile: mobile })
    setAssignMobile(p => ({ ...p, [slotId]: '' }))
    pushNotif(`${fl.name} directly assigned to "${name || initJob?.name}" – ${roles.find(r => r.id === slotId)?.category}`)
  }

  function removeFreelancer(slotId: string) {
    slotUpdate(slotId, { status: 'Open', freelancerMobile: undefined, agreedRate: undefined })
  }

  function deleteSlot(slotId: string) {
    setRoles(p => p.filter(r => r.id !== slotId))
  }

  function addCategory() {
    const cat = newCat.trim()
    if (!cat) return
    setRoles(p => [...p, { id: newSlotId(), category: cat, status: 'Open' }])
    setNewCat('')
  }

  function save() {
    if (!name.trim() || !date || !location.trim()) { alert('Please fill in Job Name, Date, and Location.'); return }
    const priceNum = parseInt(price.replace(/[^\d]/g, ''), 10) || 0
    if (isNew) {
      addJob({ id: newJobId(), name: name.trim(), date, location: location.trim(), price: priceNum, roles })
      pushNotif(`New job created: "${name.trim()}"`)
    } else {
      updateJob({ ...initJob!, name: name.trim(), date, location: location.trim(), price: priceNum, roles })
      pushNotif(`Job updated: "${name.trim()}"`)
    }
    onClose()
  }

  const fl = (slotId: string) => {
    const slot = roles.find(r => r.id === slotId)
    return slot?.freelancerMobile ? FREELANCER_DB[slot.freelancerMobile] : undefined
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 500,
      background: 'rgba(10,10,30,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: '#fff', borderRadius: 16,
        width: '100%', maxWidth: 640,
        maxHeight: '90vh', overflowY: 'auto',
        padding: '28px 30px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: 18, color: '#1a1a2e' }}>
            {isNew ? '✨ Create New Job' : `✏️ Edit: ${initJob.name}`}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#888' }}>✕</button>
        </div>

        {/* Job fields */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={labelStyle}>Job Name *</label>
            <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} placeholder="e.g. Sharma Wedding" />
          </div>
          <div>
            <label style={labelStyle}>Date *</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Budget (₹)</label>
            <input value={price} onChange={e => setPrice(e.target.value)} style={inputStyle} placeholder="125000" />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label style={labelStyle}>Location *</label>
            <input value={location} onChange={e => setLocation(e.target.value)} style={inputStyle} placeholder="Venue, City" />
          </div>
        </div>

        {/* Role slots */}
        <div style={{ borderTop: '1px solid #f0f4f8', paddingTop: 18, marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <PersonIcon />
            <span style={{ fontWeight: 600, fontSize: 14, color: '#1a1a2e' }}>Role Assignments</span>
          </div>

          {roles.length === 0 && (
            <div style={{ fontSize: 13, color: '#aaa', marginBottom: 12 }}>No roles yet. Add a category below.</div>
          )}

          {roles.map(slot => {
            const freelancer = fl(slot.id)
            const mobileInput = assignMobile[slot.id] ?? ''
            const previewFl = FREELANCER_DB[mobileInput.trim()]

            return (
              <div key={slot.id} style={{
                background: '#fafafa', borderRadius: 10,
                border: '1px solid #f0f4f8',
                padding: '12px 14px', marginBottom: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#333' }}>{slot.category}</span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{
                      ...statusStyles[slot.status],
                      borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 500,
                    }}>{slot.status}</span>
                    {slot.status !== 'Completed' && (
                      <button onClick={() => deleteSlot(slot.id)}
                        title="Delete slot"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 2 }}>
                        <TrashIcon />
                      </button>
                    )}
                  </div>
                </div>

                {/* Freelancer info */}
                {freelancer && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: slot.status !== 'Completed' ? 8 : 0, fontSize: 13, color: '#444' }}>
                    <span>👤 {freelancer.name} <span style={{ color: '#aaa' }}>· {freelancer.mobile}</span></span>
                    {slot.status !== 'Completed' && (
                      <button onClick={() => removeFreelancer(slot.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 12 }}>
                        Remove
                      </button>
                    )}
                  </div>
                )}

                {/* Status change buttons */}
                {slot.status === 'Assigned' && (
                  <button
                    onClick={() => slotUpdate(slot.id, { status: 'Completed' })}
                    style={{ ...smallBtnStyle, background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', marginBottom: 8 }}>
                    ✓ Mark Complete
                  </button>
                )}

                {/* Assign form for Open slots */}
                {(slot.status === 'Open') && (
                  <div style={{ marginTop: 6 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input
                        value={mobileInput}
                        onChange={e => setAssignMobile(p => ({ ...p, [slot.id]: e.target.value }))}
                        placeholder="Enter freelancer mobile number"
                        style={{ ...inputStyle, flex: 1, fontSize: 12, padding: '6px 10px' }}
                      />
                    </div>
                    {mobileInput.trim() && (
                      <div style={{ fontSize: 12, marginTop: 4, marginBottom: 6, color: previewFl ? '#059669' : '#ef4444' }}>
                        {previewFl ? `✓ ${previewFl.name} found` : '✗ Mobile not found in registry'}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                      <button onClick={() => sendRequest(slot.id)}
                        disabled={!previewFl}
                        style={{ ...smallBtnStyle, background: previewFl ? '#eff6ff' : '#f4f4f4', color: previewFl ? '#3b82f6' : '#aaa', border: `1px solid ${previewFl ? '#bfdbfe' : '#e0e0e0'}` }}>
                        📨 Send Request
                      </button>
                      <button onClick={() => assignDirect(slot.id)}
                        disabled={!previewFl}
                        style={{ ...smallBtnStyle, background: previewFl ? '#f0fdf4' : '#f4f4f4', color: previewFl ? '#16a34a' : '#aaa', border: `1px solid ${previewFl ? '#bbf7d0' : '#e0e0e0'}` }}>
                        ⚡ Assign Directly
                      </button>
                    </div>
                  </div>
                )}

                {/* Pending – can cancel request */}
                {slot.status === 'Pending' && (
                  <button onClick={() => removeFreelancer(slot.id)}
                    style={{ ...smallBtnStyle, background: '#fff8e6', color: '#f59e0b', border: '1px solid #fde68a', marginTop: 4 }}>
                    ✕ Cancel Request
                  </button>
                )}
              </div>
            )
          })}

          {/* Add new category */}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <input
              value={newCat}
              onChange={e => setNewCat(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCategory()}
              placeholder="New category (e.g. Reels, Portrait)"
              style={{ ...inputStyle, flex: 1, fontSize: 13 }}
            />
            <button onClick={addCategory}
              style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #1dbde6', background: '#f0f9ff', color: '#1dbde6', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              + Add
            </button>
          </div>
        </div>

        {/* Footer buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8, borderTop: '1px solid #f0f4f8' }}>
          <button onClick={onClose}
            style={{ padding: '9px 20px', borderRadius: 8, border: '1px solid #e8ecf0', background: '#fff', cursor: 'pointer', fontSize: 14, color: '#555' }}>
            Cancel
          </button>
          <button onClick={save}
            style={{ padding: '9px 22px', borderRadius: 8, border: 'none', background: 'linear-gradient(90deg, #1dbde6, #4a9eff)', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
            {isNew ? '✓ Create Job' : '💾 Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 500, color: '#666', marginBottom: 5 }
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: '1px solid #e8ecf0', fontSize: 14, color: '#1a1a2e',
  boxSizing: 'border-box', outline: 'none', background: '#fff',
}
const smallBtnStyle: React.CSSProperties = {
  padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 500,
}

/* ─── Freelancer Accept/Decline Panel ───────────────────────────── */
function FreelancerRequestCard({ job, slotId }: { job: Job; slotId: string }) {
  const { updateJob, pushNotif } = useLumiere()
  const [rateInput, setRateInput] = useState('')
  const [showRate, setShowRate] = useState(false)
  const slot = job.roles.find(r => r.id === slotId)
  if (!slot) return null

  function accept() {
    const rate = parseInt(rateInput.replace(/[^\d]/g, ''), 10) || undefined
    const newRoles = job.roles.map(r =>
      r.id === slotId ? { ...r, status: 'Assigned' as SlotStatus, agreedRate: rate } : r
    )
    updateJob({ ...job, roles: newRoles })
    pushNotif(`You accepted "${job.name}" – ${slot.category}${rate ? ` at ₹${rate.toLocaleString('en-IN')}` : ''}`)
  }

  function decline() {
    const newRoles = job.roles.map(r =>
      r.id === slotId ? { ...r, status: 'Open' as SlotStatus, freelancerMobile: undefined } : r
    )
    updateJob({ ...job, roles: newRoles })
    pushNotif(`You declined "${job.name}" – ${slot.category}`)
  }

  return (
    <div style={{ background: '#eff6ff', borderRadius: 10, border: '1px solid #bfdbfe', padding: '14px 16px' }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: '#1e40af', marginBottom: 4 }}>{job.name}</div>
      <div style={{ fontSize: 13, color: '#555', marginBottom: 4, display: 'flex', gap: 12 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CalIcon />{job.date}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><LocIcon />{job.location}</span>
      </div>
      <div style={{ fontSize: 13, color: '#3b82f6', marginBottom: 10, fontWeight: 500 }}>Role: {slot.category}</div>

      {showRate ? (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <input
            value={rateInput}
            onChange={e => setRateInput(e.target.value)}
            placeholder="Your rate (₹) – optional"
            style={{ ...inputStyle, flex: 1, fontSize: 13, padding: '7px 10px' }}
          />
          <button onClick={accept}
            style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: '#059669', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            ✓ Confirm
          </button>
          <button onClick={() => setShowRate(false)}
            style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid #e8ecf0', background: '#fff', color: '#888', cursor: 'pointer', fontSize: 13 }}>
            Cancel
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowRate(true)}
            style={{ padding: '7px 18px', borderRadius: 8, border: 'none', background: '#059669', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            ✓ Accept
          </button>
          <button onClick={decline}
            style={{ padding: '7px 18px', borderRadius: 8, border: '1px solid #fca5a5', background: '#fff', color: '#ef4444', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            ✗ Decline
          </button>
        </div>
      )}
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────────────── */
export function LumiereJobHub() {
  const { viewMode, authLevel, jobs } = useLumiere()
  const [filter, setFilter] = useState<Filter>('all')
  const [editJob, setEditJob] = useState<Job | null | 'new'>(undefined as unknown as Job | null | 'new')
  const [modalOpen, setModalOpen] = useState(false)

  const isPhotographer = viewMode === 'studio'
  const showPrice = authLevel === 'manager'

  const TABS: { id: Filter; label: string }[] = [
    { id: 'all', label: 'All Jobs' },
    { id: 'past', label: 'Past' },
    { id: 'current', label: 'Current' },
    { id: 'future', label: 'Future' },
  ]

  /* Freelancer: only jobs relevant to MY_MOBILE */
  const visibleJobs = isPhotographer
    ? jobs.filter(j => filter === 'all' || classify(j.date) === filter)
    : jobs
      .filter(j => j.roles.some(r => r.freelancerMobile === MY_MOBILE))
      .filter(j => filter === 'all' || classify(j.date) === filter)

  /* Freelancer pending requests (across all months) */
  const pendingRequests = !isPhotographer
    ? jobs.flatMap(j =>
      j.roles
        .filter(r => r.freelancerMobile === MY_MOBILE && r.status === 'Pending')
        .map(r => ({ job: j, slotId: r.id }))
    )
    : []

  function openEdit(job: Job) { setEditJob(job); setModalOpen(true) }
  function openCreate() { setEditJob(null); setModalOpen(true) }
  function closeModal() { setModalOpen(false) }

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: 700, fontSize: 26, color: '#1a1a2e' }}>
            {isPhotographer ? 'Job Hub' : 'My Assignments'}
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: '#888' }}>
            {isPhotographer
              ? 'Manage all your photography projects in one place.'
              : 'Your assigned shoots and pending requests.'}
          </p>
        </div>
        {isPhotographer && (
          <button onClick={openCreate} style={{
            padding: '9px 20px', borderRadius: 10,
            border: 'none', background: 'linear-gradient(90deg, #1dbde6, #4a9eff)',
            color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14,
          }}>+ New Job</button>
        )}
      </div>

      {/* Freelancer: Pending Requests section */}
      {!isPhotographer && pendingRequests.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700, color: '#1e40af' }}>
            📬 Pending Requests ({pendingRequests.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pendingRequests.map(({ job, slotId }) => (
              <FreelancerRequestCard key={`${job.id}-${slotId}`} job={job} slotId={slotId} />
            ))}
          </div>
          <div style={{ borderTop: '1px solid #e8ecf0', margin: '20px 0' }} />
        </div>
      )}

      {/* Filter tabs */}
      <div style={{
        display: 'inline-flex', gap: 4,
        background: '#fff', border: '1px solid #e8ecf0',
        borderRadius: 12, padding: 4, marginBottom: 24,
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setFilter(t.id)} style={{
            border: 'none', cursor: 'pointer', padding: '7px 18px', borderRadius: 8,
            fontSize: 14, fontWeight: filter === t.id ? 600 : 400,
            background: filter === t.id ? 'linear-gradient(90deg, #1dbde6, #4a9eff)' : 'transparent',
            color: filter === t.id ? '#fff' : '#55556e',
            transition: 'all 0.15s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Job cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))', gap: 16 }}>
        {visibleJobs.map(job => {
          /* Freelancer: only show their relevant roles */
          const rolesToShow = isPhotographer
            ? job.roles
            : job.roles.filter(r => r.freelancerMobile === MY_MOBILE && r.status !== 'Pending')

          return (
            <div key={job.id} style={{
              background: '#fff', borderRadius: 14, border: '1px solid #e8ecf0', padding: '20px 22px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a2e' }}>{job.name}</div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 5, color: '#666', fontSize: 13 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><CalIcon />{job.date}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><LocIcon />{job.location}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {showPrice && (
                    <span style={{ background: '#059669', color: '#fff', fontWeight: 700, fontSize: 13, borderRadius: 8, padding: '5px 12px', whiteSpace: 'nowrap' }}>
                      {fmtPrice(job.price)}
                    </span>
                  )}
                  {isPhotographer && (
                    <button onClick={() => openEdit(job)}
                      title="Edit job"
                      style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid #e8ecf0', background: '#fff', cursor: 'pointer', color: '#55556e' }}>
                      <EditIcon />
                    </button>
                  )}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f0f4f8', margin: '12px 0' }} />

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: '#555', fontSize: 13 }}>
                  <PersonIcon />
                  <span style={{ fontWeight: 500 }}>
                    {isPhotographer ? 'Role Assignments' : 'Your Roles'}
                  </span>
                </div>
                {rolesToShow.map(r => {
                  const fln = r.freelancerMobile ? FREELANCER_DB[r.freelancerMobile] : undefined
                  return (
                    <div key={r.id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '6px 0', borderBottom: '1px solid #f8f9fa', fontSize: 14, color: '#333',
                    }}>
                      <span>
                        {r.category}
                        {isPhotographer && fln && (
                          <span style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>({fln.name})</span>
                        )}
                      </span>
                      <span style={{ ...statusStyles[r.status], borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 500 }}>
                        {r.status}
                      </span>
                    </div>
                  )
                })}
                {rolesToShow.length === 0 && (
                  <div style={{ fontSize: 13, color: '#aaa' }}>No active assignments in this job.</div>
                )}
              </div>
            </div>
          )
        })}
        {visibleJobs.length === 0 && (
          <div style={{ fontSize: 14, color: '#888', padding: 20 }}>
            {isPhotographer ? 'No jobs found for this filter.' : 'No assignments for this filter.'}
          </div>
        )}
      </div>

      {/* Edit / Create modal */}
      {modalOpen && (
        <JobModal job={editJob === 'new' ? null : editJob} onClose={closeModal} />
      )}
    </div>
  )
}
