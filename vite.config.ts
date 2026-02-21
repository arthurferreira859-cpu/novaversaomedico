
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Aumenta o limite para 1000kb para evitar o aviso visual no Vercel
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Divide as dependências em um bloco separado (vendor) para melhor cache e performance
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('@google/genai')) return 'ai-engine';
            return 'vendor';
          }
        },
      },
    },
  },
  // Garante que o process.env seja acessível durante o build
  define: {
    'process.env': process.env
  }
});
