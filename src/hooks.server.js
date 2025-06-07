export async function handle({ event, resolve }) {
  // Process the request
  const response = await resolve(event);
  
  // Add comprehensive security headers to all responses
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN'); // Allow reCAPTCHA iframe
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  // Define Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://sandbox.web.squarecdn.com https://www.google.com https://www.gstatic.com", // Allow Square, reCAPTCHA, and inline scripts
    "script-src-elem 'self' 'unsafe-inline' https://sandbox.web.squarecdn.com https://www.google.com https://www.gstatic.com", // Allow inline scripts, Square, and reCAPTCHA
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com https://sandbox.web.squarecdn.com", // Allow styles from self, inline, and Google Fonts
    "img-src 'self' data: https://sandbox.web.squarecdn.com", // Allow images from self, data URIs, and Square CDN
    "connect-src 'self' https://sandbox.squareupsandbox.com https://pci-connect.squareupsandbox.com https://*.google.com https://book-reviews.pockethost.io https://o160250.ingest.sentry.io https://square-fonts-production-f.squarecdn.com https://d1g145x70srn7h.cloudfront.net", // Allow connections to Square API, Google, PocketHost, Sentry, and Square font CDNs
    "frame-src 'self' https://sandbox.web.squarecdn.com https://www.google.com", // Allow frames from Square and reCAPTCHA
    "font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://square-fonts-production-f.squarecdn.com https://d1g145x70srn7h.cloudfront.net", // Allow fonts from self, Google, and Square CDNs
    "object-src 'none'", // Disallow objects
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'"
  ].join('; ');
  response.headers.set('Content-Security-Policy', csp);

  return response;
}