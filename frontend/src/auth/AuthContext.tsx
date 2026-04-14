import { createContext, useContext, useMemo, useState } from 'react'
import type { AuthState, AuthUser } from '../types/auth'

interface AuthContextValue extends AuthState {
  login: (token: string, user: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('brain_token'))
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem('brain_user')
    return raw ? (JSON.parse(raw) as AuthUser) : null
  })

  const value = useMemo(
    () => ({
      token,
      user,
      login(nextToken: string, nextUser: AuthUser) {
        setToken(nextToken)
        setUser(nextUser)
        localStorage.setItem('brain_token', nextToken)
        localStorage.setItem('brain_user', JSON.stringify(nextUser))
      },
      logout() {
        setToken(null)
        setUser(null)
        localStorage.removeItem('brain_token')
        localStorage.removeItem('brain_user')
      }
    }),
    [token, user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
