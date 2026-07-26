import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

/**
 * manualChunks — 1.2.1 polish (WP1)
 * Split heavy SME technical + congress packs + large vendors so main entry is smaller.
 * Counts stay sync-imported for smoke/tests; chunks load in parallel on first paint.
 */
function manualChunks(id: string): string | undefined {
  const norm = id.replace(/\\/g, '/')
  if (norm.includes('node_modules')) {
    if (
      norm.includes('/three/') ||
      norm.includes('/three-stdlib/') ||
      norm.includes('@react-three') ||
      norm.includes('/maath/') ||
      norm.includes('/meshoptimizer/') ||
      norm.includes('/troika-')
    ) {
      return 'vendor-three'
    }
    if (norm.includes('leaflet') || norm.includes('react-leaflet')) {
      return 'vendor-leaflet'
    }
    if (norm.includes('framer-motion') || norm.includes('/motion-dom/') || norm.includes('/motion-utils/')) {
      return 'vendor-motion'
    }
    if (norm.includes('lucide-react')) return 'vendor-icons'
    if (norm.includes('/react-dom/') || norm.includes('/react/') || norm.includes('/scheduler/')) {
      return 'vendor-react'
    }
    return 'vendor'
  }
  if (norm.includes('/data/sme/technicalLenses')) return 'sme-technical'
  if (norm.includes('/lib/sme/rules')) return 'sme-rules'
  if (norm.includes('/data/sme/lenses')) return 'sme-governance'
  if (
    norm.includes('/useCases/congressDesks') ||
    norm.includes('/useCases/congressStories') ||
    norm.includes('/useCases/congressSources') ||
    norm.includes('/useCases/congressSimulations')
  ) {
    return 'congress-pack'
  }
  return undefined
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks,
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
  server: {
    // Bind IPv4 explicitly — avoids localhost/::1 only + 0x800700E8 launch oddities on Windows
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    open: false,
    hmr: {
      overlay: false,
      host: '127.0.0.1',
    },
    watch: {
      // Ignore icon files used only for the desktop shortcut (prevents EBUSY watcher errors on Windows)
      ignored: ['**/compass-rose*.ico', '**/compass-rose*.jpg', '**/*.log'],
    },
    // Proxy public APIs (avoids browser CORS issues in dev)
    proxy: {
      '/api/overpass': {
        target: 'https://overpass-api.de',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/overpass/, '/api/interpreter'),
      },
      // USASpending.gov — browser calls /api/usaspending/api/v2/...
      '/api/usaspending': {
        target: 'https://api.usaspending.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/usaspending/, ''),
      },
      // U.S. Census Geocoder (free, no key)
      '/api/census': {
        target: 'https://geocoding.geo.census.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/census/, ''),
      },
      // Nominatim — set identity via User-Agent from client
      '/api/nominatim': {
        target: 'https://nominatim.openstreetmap.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/nominatim/, ''),
      },
      // OpenFEMA (free, no key)
      '/api/openfema': {
        target: 'https://www.fema.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openfema/, ''),
      },
    },
  },
})
