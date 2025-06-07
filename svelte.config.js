import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      // default options are shown
      pages: 'build',
      assets: 'build',
      fallback: '200.html',
      precompress: false
    }),
    prerender: {
      // This ensures all pages are prerendered
      entries: ['*']
    }
  }
};

export default config;
