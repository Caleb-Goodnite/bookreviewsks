/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    const response = await resolve(event, {
      filterSerializedResponseHeaders(name) {
        // Send all headers to client
        return true;
      }
    });
  
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self';",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.squareup.com https://*.web.squarecdn.com https://*.squarecdn.com https://*.square.com https://*.google.com https://*.googletagmanager.com https://va.vercel-scripts.com;",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://sandbox.web.squarecdn.com https://*.web.squarecdn.com https://*.squarecdn.com;",
        "font-src 'self' https://fonts.gstatic.com;",
        "img-src 'self' data: https://*.squarecdn.com https://*.squareup.com https://*.web.squarecdn.com https://book-reviews.pockethost.io https://*.googleusercontent.com;",
        "connect-src 'self' https://book-reviews.pockethost.io https://*.squareup.com https://*.web.squarecdn.com https://*.squarecdn.com https://*.square.com https://pci-connect.squareupsandbox.com https://pci-connect.squareup.com https://ingest.sentry.io https://o160250.ingest.sentry.io https://*.googleapis.com https://*.google.com;",
        "frame-src 'self' https://*.squareup.com https://*.web.squarecdn.com https://*.squarecdn.com https://*.square.com;",
        "object-src 'none';",
        "base-uri 'self';"
      ].join(' ')
    );
  
    // Other security headers
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=()');
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  
    // Uncomment if your site uses HTTPS and you want HSTS
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
    return response;
  }
  