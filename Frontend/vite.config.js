import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/login': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/sign-up': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/logout': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})