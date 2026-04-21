import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Separate from the React app; default port 5180 to avoid clashing with 5175.
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5180,
    strictPort: false,
  },
});
