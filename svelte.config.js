import adapter from '@sveltejs/adapter-netlify';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      // Enable edge functions for better performance
      edge: true,
      // Keep the function as a single file
      split: false
    }),
    // Handle client-side routing
    paths: {
      base: ''
    },
    // Prerender all pages
    prerender: {
      entries: ['*'],
      handleHttpError: 'warn'
    },
    // Enable client-side routing
    alias: {
      $lib: './src/lib',
      $components: './src/components'
    }
  }
};

export default config;
