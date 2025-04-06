/**
 * Simple Web Application Firewall (WAF) middleware
 */

// Common SQL injection patterns
const sqlInjectionPatterns = [
  /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
  /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
  /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
  /((\%27)|(\'))union/i
];

// Common XSS patterns
const xssPatterns = [
  /((\%3C)|<)((\%2F)|\/)*[a-z0-9\%]+((\%3E)|>)/i,
  /((\%3C)|<)((\%69)|i|(\%49))((\%6D)|m|(\%4D))((\%67)|g|(\%47))[^\n]+((\%3E)|>)/i,
  /((\%3C)|<)[^\n]+((\%3E)|>)/i
];

// Path traversal patterns
const pathTraversalPatterns = [
  /(\.\.\/)/i,
  /(\.\.\\)/i,
  /(%2e%2e%2f)/i
];

// Check if a request contains malicious patterns
export function detectMaliciousRequest(request) {
  const url = request.url;
  const method = request.method;
  
  // Only check GET requests with query parameters or POST/PUT requests
  if (method === 'GET' && !url.includes('?')) {
    return false;
  }
  
  let content = url;
  
  // For POST/PUT requests, check the body as well
  if (method === 'POST' || method === 'PUT') {
    // This is simplified - in a real implementation you'd need to parse the body
    // which is more complex as it's a stream
    // For now, we'll just check the URL
  }
  
  // Check for SQL injection
  for (const pattern of sqlInjectionPatterns) {
    if (pattern.test(content)) {
      console.warn('SQL injection attempt detected:', content);
      return true;
    }
  }
  
  // Check for XSS
  for (const pattern of xssPatterns) {
    if (pattern.test(content)) {
      console.warn('XSS attempt detected:', content);
      return true;
    }
  }
  
  // Check for path traversal
  for (const pattern of pathTraversalPatterns) {
    if (pattern.test(content)) {
      console.warn('Path traversal attempt detected:', content);
      return true;
    }
  }
  
  return false;
}