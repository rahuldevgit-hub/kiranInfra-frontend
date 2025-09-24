// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // // Read token and slug
  // const token = request.cookies.get('admin_token')?.value;
  // // Function to clear all cookies
  // const clearAllCookies = (response: NextResponse) => {
  //   request.cookies.getAll().forEach((cookie) => {
  //     response.cookies.set(cookie.name, '', { path: '/', maxAge: 0 });
  //   });
  //   return response;
  // };

  // // If no token, clear cookies and redirect
  // if (!token) {
  //   const response = NextResponse.redirect(new URL('/administrator', request.url));
  //   return clearAllCookies(response);
  // }

  // // Authorized → continue
  // return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};