import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // Use the auto adapter which automatically chooses the right adapter for your deployment target
    adapter: adapter(),
    // Prerender settings
    prerender: {
      // This ensures all pages are prerendered when possible
      entries: ['*'],
      // Handle 404s properly
      handleHttpError: 'warn'
    }
  }
};

export default config;
