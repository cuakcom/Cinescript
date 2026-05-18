import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ui': path.resolve(__dirname, './src/ui'),
      '@core': path.resolve(__dirname, './src/core'),
      '@components': path.resolve(__dirname, './src/ui/components'),
      '@services': path.resolve(__dirname, './src/core/services'),
      '@models': path.resolve(__dirname, './src/core/models'),
      '@store': path.resolve(__dirname, './src/core/store'),
    },
  },
  build: {
    outDir: 'dist',
  },
  server: {
    strictPort: true,
    port: 1420,
  },
})
