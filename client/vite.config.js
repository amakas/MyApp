import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   build: {
        outDir: '../server/client/dist', // Щоб збирати прямо в серверну папку
        emptyOutDir: true
    },
    server: {
        proxy: {
            '/api': 'http://localhost:5000' // Проксі для API під час розробки
        }
    }
})
