import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  // Add this if you're having issues with environment variables
  define: {
    'process.env': process.env
  }
});
