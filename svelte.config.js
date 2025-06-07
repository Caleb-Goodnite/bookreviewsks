import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      // default options are shown. On some platforms
      // these options are set automatically — see below
      pages: 'build',
      assets: 'build',
      fallback: '200.html',
      precompress: false,
      strict: true
    }),
    // Add this to handle client-side routing
    paths: {
      base: process.env.NODE_ENV === 'production' ? '' : ''
    },
    // This tells SvelteKit to handle 404s with your app
    // and not with a static 404 page
    trailingSlash: 'always',
    prerender: {
      // This will create a fallback page for non-prerendered pages
      entries: ['*']
    }
  }
};

export default config;
