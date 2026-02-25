import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/give-me-money-discord/', // 請替換成您的 Repo 名稱，例如 '/givememoney/'
})
