import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type ViewMode = 'studio' | 'freelancer'
export type AuthLevel = 'manager' | 'staff'
export type SlotStatus = 'Open' | 'Pending' | 'Assigned' | 'Completed'

export interface Freelancer {
  mobile: string   // PRIMARY KEY
  name: string
  skills: string[]
}

export interface RoleSlot {
  id: string
  category: string
  status: SlotStatus
  freelancerMobile?: string  // FK → Freelancer.mobile
  agreedRate?: number        // rate freelancer agreed to
}

export interface Job {
  id: number
  name: string
  date: string
  location: string
  price: number
  roles: RoleSlot[]
}

export interface LumiereNotif {
  id: number
  text: string
  read: boolean
  time: string
}

// Freelancer directory: mobile number is the PRIMARY KEY
export const FREELANCER_DB: Record<string, Freelancer> = {
  '9876500001': { mobile: '9876500001', name: 'Arjun Mehta', skills: ['Candid', 'Traditional'] },
  '9876500002': { mobile: '9876500002', name: 'Priya Singh', skills: ['Drone', 'Candid'] },
  '9876500003': { mobile: '9876500003', name: 'Rahul Verma', skills: ['Traditional'] },
  '9876500004': { mobile: '9876500004', name: 'Sneha Patel', skills: ['Candid', 'Drone'] },
}

// The "current user" when in Freelancer mode
export const MY_MOBILE = '9876500004'

const SEED_JOBS: Job[] = [
  {
    id: 1, name: 'Sharma Wedding', date: '2026-05-15',
    location: 'The Grand Palace, Mumbai', price: 125000,
    roles: [
      { id: 's1', category: 'Candid', status: 'Assigned', freelancerMobile: '9876500001' },
      { id: 's2', category: 'Drone', status: 'Assigned', freelancerMobile: '9876500002' },
      { id: 's3', category: 'Traditional', status: 'Open' },
    ],
  },
  {
    id: 2, name: 'Mehta Anniversary', date: '2026-05-08',
    location: 'Taj Hotel, Bangalore', price: 85000,
    roles: [
      { id: 's4', category: 'Candid', status: 'Assigned', freelancerMobile: '9876500001' },
      { id: 's5', category: 'Traditional', status: 'Assigned', freelancerMobile: '9876500003' },
    ],
  },
  {
    id: 3, name: 'Kumar Reception', date: '2026-04-22',
    location: 'Leela Palace, Goa', price: 150000,
    roles: [
      { id: 's6', category: 'Candid', status: 'Completed', freelancerMobile: '9876500004' },
      { id: 's7', category: 'Drone', status: 'Completed', freelancerMobile: '9876500002' },
      { id: 's8', category: 'Traditional', status: 'Completed', freelancerMobile: '9876500003' },
    ],
  },
  {
    id: 4, name: 'Patel Engagement', date: '2026-05-20',
    location: 'ITC Windsor, Chennai', price: 65000,
    roles: [
      { id: 's9', category: 'Candid', status: 'Pending', freelancerMobile: '9876500004' },
      { id: 's10', category: 'Drone', status: 'Open' },
    ],
  },
  {
    id: 5, name: 'Reddy Wedding', date: '2026-04-18',
    location: 'Ramada Plaza, Hyderabad', price: 95000,
    roles: [
      { id: 's11', category: 'Candid', status: 'Completed', freelancerMobile: '9876500001' },
      { id: 's12', category: 'Traditional', status: 'Completed', freelancerMobile: '9876500003' },
    ],
  },
]

const SEED_NOTIFS: LumiereNotif[] = [
  { id: 1, text: 'Arjun Mehta accepted Sharma Wedding – Candid', read: false, time: '2h ago' },
  { id: 2, text: 'Request sent: Patel Engagement – Candid → Sneha Patel', read: false, time: '4h ago' },
  { id: 3, text: 'Priya Singh confirmed Drone for Mehta Anniversary', read: true, time: '1d ago' },
  { id: 4, text: 'Kumar Reception: all roles completed ✓', read: true, time: '2d ago' },
]

interface LumiereCtxValue {
  viewMode: ViewMode
  setViewMode: (m: ViewMode) => void
  authLevel: AuthLevel
  setAuthLevel: (a: AuthLevel) => void
  jobs: Job[]
  updateJob: (j: Job) => void
  addJob: (j: Job) => void
  notifs: LumiereNotif[]
  markAllRead: () => void
  pushNotif: (text: string) => void
  newSlotId: () => string
  newJobId: () => number
}

const LumiereCtx = createContext<LumiereCtxValue | null>(null)

export function LumiereProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ViewMode>('studio')
  const [authLevel, setAuthLevel] = useState<AuthLevel>('manager')
  const [jobs, setJobs] = useState<Job[]>(SEED_JOBS)
  const [notifs, setNotifs] = useState<LumiereNotif[]>(SEED_NOTIFS)

  const updateJob = useCallback((j: Job) =>
    setJobs(p => p.map(x => x.id === j.id ? j : x)), [])

  const addJob = useCallback((j: Job) =>
    setJobs(p => [...p, j]), [])

  const markAllRead = useCallback(() =>
    setNotifs(p => p.map(n => ({ ...n, read: true }))), [])

  const pushNotif = useCallback((text: string) =>
    setNotifs(p => [{ id: Date.now(), text, read: false, time: 'just now' }, ...p.slice(0, 19)]), [])

  const newSlotId = useCallback(() => `slot_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, [])
  const newJobId = useCallback(() => Date.now(), [])

  return (
    <LumiereCtx.Provider value={{
      viewMode, setViewMode,
      authLevel, setAuthLevel,
      jobs, updateJob, addJob,
      notifs, markAllRead, pushNotif,
      newSlotId, newJobId,
    }}>
      {children}
    </LumiereCtx.Provider>
  )
}

export function useLumiere() {
  const c = useContext(LumiereCtx)
  if (!c) throw new Error('useLumiere must be inside LumiereProvider')
  return c
}
