import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png'],
      strategies: 'injectManifest',
      injectManifest: {
        injectionPoint: undefined
      },
      manifest: {
        name: 'Minimal Calendar App',
        short_name: 'Calendar',
        description: 'A lightweight, installable calendar PWA',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icons/icon-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    host: '0.0.0.0',          // allows external access
    port: 5173,               // Vite's default dev port
    strictPort: true,
    watch: {
      usePolling: true        // crucial for file change detection in Docker
    },
    proxy: {
      '/events': 'http://server:3000',
      '/reminders': 'http://server:3000'
    }
  }
})
