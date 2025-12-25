import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'), // raiz do projeto
        'components': path.resolve(__dirname, 'components'), // para importar AdminDashboard mais fácil
      },
    },
    optimizeDeps: {
      include: ['axios'], // força Vite a processar axios
    },
    build: {
      rollupOptions: {
        external: [], // não externaliza axios
      },
    },
  };
});
