import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5175,
    strictPort: false,
  },
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
  build: {
    rollupOptions: {
      output: {
        // Split heavy vendor libraries into separate named chunks.
        // Combined with React.lazy() in App.tsx, these are only downloaded
        // when the user first navigates to the corresponding view.
        manualChunks: {
          // React core — tiny, loaded immediately
          'vendor-react': ['react', 'react-dom'],
          // Three.js ecosystem (~1.5 MB) — only loaded when Simulator opens
          'vendor-three': [
            'three',
            '@react-three/fiber',
            '@react-three/drei',
          ],
          // ReactFlow — only loaded when Topology view opens
          'vendor-xyflow': ['@xyflow/react'],
        },
      },
    },
  },
});
