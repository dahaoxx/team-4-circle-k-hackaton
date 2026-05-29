import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Proxy /api to the .NET CircleK.ProxyApi so the SPA is same-origin in dev.
    proxy: {
      '/api': {
        target: 'http://localhost:5180',
        changeOrigin: true,
      },
    },
  },
})
