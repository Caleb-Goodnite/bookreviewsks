// Enable prerendering and SPA mode for Netlify
export const prerender = true;
export const ssr = false; // Disable server-side rendering for SPA mode

// This ensures all routes are handled by the SPA
export const trailingSlash = 'always';
