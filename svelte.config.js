import adapter from '@sveltejs/adapter-netlify';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      // Netlify adapter handles the routing automatically
      edge: false,
      split: false
    }),
    // Handle client-side routing
    paths: {
      base: ''
    },
    // Prerender all pages
    prerender: {
      entries: ['*']
    }
  }
};

export default config;
