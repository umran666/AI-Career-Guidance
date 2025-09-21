import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // pre-bundle lucide-react so Vite serves a single optimized module
    // instead of dozens of individual icon files which some browser
    // blockers (adblock/extension rules) can mistakenly block.
    include: ['lucide-react'],
  },
});
