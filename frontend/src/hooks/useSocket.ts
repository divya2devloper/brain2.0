import { useEffect } from 'react'
import { io } from 'socket.io-client'

export function useSocket(event: string, onMessage: (payload: unknown) => void) {
  useEffect(() => {
    const socket = io(import.meta.env.VITE_ORCHESTRATOR_URL || 'http://localhost:2021')
    socket.on(event, onMessage)
    return () => {
      socket.off(event, onMessage)
      socket.disconnect()
    }
  }, [event, onMessage])
}
