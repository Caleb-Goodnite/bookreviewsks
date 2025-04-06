import { dev } from '$app/environment';

/**
 * Security configuration for the Book ReViews application
 */

// Security headers to apply to all responses
export const securityHeaders = {
  // Prevent browsers from incorrectly detecting non-scripts as scripts
  'X-Content-Type-Options': 'nosniff',
  
  // Prevent clickjacking attacks
  'X-Frame-Options': 'DENY',
  
  // Enable browser XSS filtering
  'X-XSS-Protection': '1; mode=block',
  
  // Control how much information is shared when navigating between origins
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Prevent loading resources from other domains
  'Content-Security-Policy': dev 
    ? "default-src 'self'; script-src 'self' 'unsafe-inline' https://sandbox.web.squarecdn.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://connect.squareupsandbox.com; frame-src 'self' https://sandbox.web.squarecdn.com;"
    : "default-src 'self'; script-src 'self' https://web.squarecdn.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://connect.square.com; frame-src 'self' https://web.squarecdn.com;",
  
  // HTTP Strict Transport Security - force HTTPS
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  
  // Permissions policy to limit features
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

// Rate limiting configuration
export const rateLimits = {
  // Default rate limit: 100 requests per minute
  default: {
    windowMs: 60 * 1000,
    maxRequests: 100
  },
  
  // API rate limit: 30 requests per minute
  api: {
    windowMs: 60 * 1000,
    maxRequests: 30
  },
  
  // Authentication rate limit: 5 attempts per minute
  auth: {
    windowMs: 60 * 1000,
    maxRequests: 5
  }
};

// IP blocking for known malicious IPs
export const blockedIPs = [
  // Add known malicious IPs here
];

// Validate request origin
export function isValidOrigin(origin) {
  const allowedOrigins = [
    'https://bookreviewsks.netlify.app',
  ];
  
  if (dev) {
    allowedOrigins.push('http://localhost:5173');
  }
  
  return allowedOrigins.includes(origin);
}