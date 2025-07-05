import { dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';
 
injectAnalytics({ mode: dev ? 'development' : 'production' });

// This file can be empty if you don't need to export anything
export const prerender = false;
export const ssr = false; // Disable server-side rendering for SPA mode
