import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  preview: {
    port: 10000,
    host: true,
    allowedHosts: [
      'hms-frontend-9jbk.onrender.com',
      'localhost',
      '.onrender.com'  
    ]
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})