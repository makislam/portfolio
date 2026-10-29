import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // The research page lazy-loads its 3D scene, so Vite only discovers these on first visit and
  // re-optimizes mid-session (504 "Outdated Optimize Dep" -> blank page). Pre-bundle them up front.
  optimizeDeps: {
    include: [
      'three',
      '@react-three/fiber',
      '@react-three/drei/core/ContactShadows.js',
      '@react-three/drei/core/OrbitControls.js',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
