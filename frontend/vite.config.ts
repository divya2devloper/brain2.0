import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5170,
    proxy: {
      '/api': 'http://localhost:2021',
      '/socket.io': {
        target: 'http://localhost:2021',
        ws: true
      }
    }
  }
})
