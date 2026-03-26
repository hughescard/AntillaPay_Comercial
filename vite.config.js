import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const pasarelaProxyTarget =
  process.env.VITE_PASARELA_PROXY_TARGET || 'http://127.0.0.1:3000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
    proxy: {
      '/pasarela': {
        target: pasarelaProxyTarget,
        changeOrigin: true,
        ws: true,
      },
      '/_next': {
        target: pasarelaProxyTarget,
        changeOrigin: true,
        ws: true,
      },
      '/__nextjs': {
        target: pasarelaProxyTarget,
        changeOrigin: true,
        ws: true,
      },
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json']
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
})
