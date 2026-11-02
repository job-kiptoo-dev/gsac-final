import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: true, // allow LAN / Docker access
      // NOTE: No proxy needed — Supabase is called directly from the browser
      // via the @supabase/supabase-js SDK using VITE_SUPABASE_URL.
    },
    define: {
      // Make env vars available at build time for debugging
      __SUPABASE_CONFIGURED__: JSON.stringify(
        !!(env.VITE_SUPABASE_URL && env.VITE_SUPABASE_URL !== 'https://your-project-ref.supabase.co')
      ),
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          // Split vendor chunks for better caching
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            supabase: ['@supabase/supabase-js'],
          },
        },
      },
    },
  }
})
