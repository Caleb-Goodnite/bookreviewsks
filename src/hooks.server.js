// SvelteKit server hooks for security headers
// Allows Square, Google Fonts, and PocketBase

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    const response = await resolve(event, {
        filterSerializedResponseHeaders(name) {
            // Allow all headers to be sent to the client
            return true;
        }
    });

    // --- Content Security Policy ---
    // Allow self, Google Fonts, Square, and PocketBase
    response.headers.set(
        'Content-Security-Policy',
        [
            "default-src 'self';",
            "script-src 'self' https://*.squareup.com https://*.google.com https://*.googletagmanager.com 'unsafe-inline';",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
            "font-src 'self' https://fonts.gstatic.com;",
            "img-src 'self' data: https://*.squarecdn.com https://*.squareup.com https://book-reviews.pockethost.io https://*.googleusercontent.com;",
            "connect-src 'self' https://book-reviews.pockethost.io https://*.squareup.com https://*.googleapis.com https://*.google.com;",
            "frame-src 'self' https://*.squareup.com;"
        ].join(' ')
    );

    // --- Other security headers ---
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=()');
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');

    // Enable HSTS for Vercel deployment (HTTPS only)
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

    return response;
}
