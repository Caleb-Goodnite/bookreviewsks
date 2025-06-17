import adapter from '@sveltejs/adapter-netlify';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // Use Netlify adapter
    adapter: adapter({
      // Enable Edge Functions (optional, set to false to use standard serverless functions)
      edge: false,
      // If you need to split your app into multiple functions, use the following:
      // split: true
    }),
    // Handle API routes properly
    files: {
      lib: 'src/lib',
      routes: 'src/routes',
      appTemplate: 'src/app.html',
      errorTemplate: 'src/error.html'
    },
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
