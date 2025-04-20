export async function handle({ event, resolve }) {
  // Process the request
  const response = await resolve(event);
  
  // Add comprehensive security headers to all responses
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Updated Content Security Policy to allow Google Fonts, PocketBase, and jsDelivr
  response.headers.set('Content-Security-Policy', [
    "default-src 'self';",
    "script-src 'self' 'unsafe-inline' https://sandbox.web.squarecdn.com https://cdn.jsdelivr.net;",
    "script-src-elem 'self' 'unsafe-inline' https://sandbox.web.squarecdn.com https://cdn.jsdelivr.net;",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
    "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com;",
    "font-src 'self' https://fonts.gstatic.com;",
    "img-src 'self' data:;",
    "connect-src 'self' https://connect.squareupsandbox.com https://book-reviews.pockethost.io;"
  ].join(' '));
  
  return response;
}