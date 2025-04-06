/**
 * Security utilities for the Book ReViews application
 */

// Generate a CSRF token
export function generateCsrfToken() {
  return crypto.randomUUID();
}

// Validate input to prevent XSS
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Validate that a value is a positive number
export function isValidAmount(amount) {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0 && isFinite(num);
}

// Rate limiting helper (simplified - would use a proper store in production)
const rateLimits = new Map();

export function checkRateLimit(identifier, maxAttempts = 5, windowMs = 60000) {
  const now = Date.now();
  const key = `${identifier}:${Math.floor(now / windowMs)}`;
  
  const attempts = rateLimits.get(key) || 0;
  if (attempts >= maxAttempts) {
    return false;
  }
  
  rateLimits.set(key, attempts + 1);
  
  // Clean up old entries
  for (const [storedKey] of rateLimits) {
    const [, timestamp] = storedKey.split(':');
    if (now - parseInt(timestamp) * windowMs > windowMs * 2) {
      rateLimits.delete(storedKey);
    }
  }
  
  return true;
}

// Secure headers helper
export function getSecureHeaders() {
  return {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' https://sandbox.web.squarecdn.com; frame-src 'self' https://sandbox.web.squarecdn.com; connect-src 'self' https://connect.squareupsandbox.com;",
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };
}