import { useEffect } from 'react'
import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_ORCHESTRATOR_URL || 'http://localhost:2021', {
  autoConnect: true
})

export function useSocket(event: string, onMessage: (payload: unknown) => void) {
  useEffect(() => {
    socket.on(event, onMessage)
    return () => {
      socket.off(event, onMessage)
    }
  }, [event, onMessage])
}
