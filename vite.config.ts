import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const geminiApiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '';

  return {
    server: {
      host: '127.0.0.1',
      port: 5173,
      strictPort: true,
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(geminiApiKey),
      'process.env.GEMINI_API_KEY': JSON.stringify(geminiApiKey),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      target: 'es2019',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;

            if (
              id.includes('react') ||
              id.includes('scheduler') ||
              id.includes('motion')
            ) {
              return 'react-vendor';
            }

            if (
              id.includes('@supabase') ||
              id.includes('@emailjs')
            ) {
              return 'admin-vendor';
            }

            if (
              id.includes('@google/genai')
            ) {
              return 'ai-vendor';
            }

            if (
              id.includes('recharts')
            ) {
              return 'charts-vendor';
            }

            if (
              id.includes('three') ||
              id.includes('ogl') ||
              id.includes('gsap') ||
              id.includes('lenis')
            ) {
              return 'animation-vendor';
            }

            if (id.includes('react-icons') || id.includes('lucide-react')) {
              return 'icons-vendor';
            }
          },
        },
      },
    },
  };
});
