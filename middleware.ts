import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Use environment variables for credentials or fallback to defaults
// In production, set these in your hosting platform (e.g., Vercel)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'securepassword';

export function middleware(request: NextRequest) {
  // Check for basic auth credentials
  const basicAuth = request.headers.get('authorization');
  
  if (basicAuth) {
    try {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');
      
      // Use constant-time comparison to prevent timing attacks
      if (timingSafeEqual(user, ADMIN_USERNAME) && timingSafeEqual(pwd, ADMIN_PASSWORD)) {
        return NextResponse.next();
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  }
  
  // Return a 401 response if authentication fails
  return new NextResponse('Authentication Required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Area"',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
    },
  });
}

// A simple constant-time comparison function to prevent timing attacks
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

// Configure the middleware to only run on the admin path
export const config = {
  matcher: '/admin/:path*',
}; 