import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',         // <-- IMPORTANT for Electron/local file loads
  
  // Tauri-specific optimizations
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries
          'react-vendor': ['react', 'react-dom', 'react-is'],
          'framer-motion': ['framer-motion'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-progress', '@radix-ui/react-tabs', '@radix-ui/react-tooltip'],
          'charts': ['recharts'],
          'utils': ['clsx', 'tailwind-merge', 'zustand']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
      }
    }
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-is',
      'framer-motion',
      'lucide-react',
      'clsx',
      'tailwind-merge',
      'recharts'
    ],
    exclude: ['@tauri-apps/api']
  },
  
  // Development optimizations
  server: {
    fs: {
      strict: false
    }
  }
})
