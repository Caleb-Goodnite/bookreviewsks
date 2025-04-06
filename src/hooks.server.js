export async function handle({ event, resolve }) {
  // Process the request
  const response = await resolve(event);
  
  // Add basic security headers to all responses
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'DENY');
  
  return response;
}