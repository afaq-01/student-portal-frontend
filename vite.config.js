import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),tailwindcss(),],
  server: {
    proxy: {
      // Proxy /api to your deployed backend during local dev
      "/api": {
        target: "https://student-portal-five-drab.vercel.app", // deployed backend
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
