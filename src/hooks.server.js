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
  
  // Basic Content Security Policy - customize based on your needs
  response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://sandbox.web.squarecdn.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://connect.squareupsandbox.com");
  
  return response;
}