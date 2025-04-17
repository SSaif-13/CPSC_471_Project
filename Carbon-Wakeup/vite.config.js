import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // needed for Docker
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://backend:5000', // points to backend service
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port: 5173,
  }
})