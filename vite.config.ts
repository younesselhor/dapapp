import { defineConfig } from 'vite';
import angular from '@vitejs/plugin-angular';

export default defineConfig({
  plugins: [angular()],
  ssr: {
    target: 'node',
    noExternal: [
      '@angular/fire',
      'firebase',
      'rxjs',
      /^@angular/,
    ],
    optimizeDeps: {
      include: ['@angular/common', '@angular/core']
    }
  },
  server: {
    hmr: true,
    watch: {
      usePolling: true  // Helpful for some Windows/WSL environments
    }
  }
});