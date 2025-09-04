import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Widget-specific build configuration for S3 deployment
// Developer: Manzi Niyongira Osee
// Year: 2025

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-widget',
    lib: {
      entry: 'src/widget/index.ts',
      name: 'ISTAuth',
      fileName: 'ist-auth-widget',
      formats: ['umd']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  define: {
    'process.env.NODE_ENV': '"production"'
  }
})
