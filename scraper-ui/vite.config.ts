import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const apiBaseUrl: string = process.env.VITE_API_BASE_URL || 'http://localhost:8000';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': apiBaseUrl,
    },
  },
});
