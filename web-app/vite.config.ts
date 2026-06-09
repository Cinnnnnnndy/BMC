import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Local dev uses './' so localhost:517x works without a /BMC/ prefix.
  // GitHub Pages build overrides this with --base /BMC/ in the CI workflow.
  base: './',
  // Bake the build timestamp into the app so the vue-topo iframe URL
  // gets a unique ?v= on each deploy, busting browser/CDN cache.
  define: {
    'import.meta.env.VITE_BUILD_TIME': JSON.stringify(String(Date.now())),
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
