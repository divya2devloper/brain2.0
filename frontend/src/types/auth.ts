export type Role = 'OWNER' | 'ADMIN' | 'MANAGER' | 'TRAINER' | 'INVESTOR'

export interface AuthUser {
  username: string
  business_id: string
  role: Role
}

export interface AuthState {
  token: string | null
  user: AuthUser | null
}
