import { handlers } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const { GET: AuthGET, POST } = handlers;
export { POST };

// Showcasing advanced initialization in Route Handlers
export async function GET(request: NextRequest) {
  console.log(`route.ts GET ${request.nextUrl.href}`)

  if (request.nextUrl.pathname === '/api/auth/signin') {
    // Redirect the user to `/sign-in` page instead of default next-auth page
    return NextResponse.redirect('http://localhost:3000/sign-in');
  }

  const urlSearchParams = new URLSearchParams(request.nextUrl.searchParams);

  const error = urlSearchParams.get('error')
  switch (error) {
    case 'AuthorizedCallbackError':
      // Redirect the user to `/sign-in` page on unsuccessful sign-in (signIn returned false)
      return NextResponse.redirect('http://localhost:3000/sign-in');
    case 'CallbackRouteError':
      // Redirect the user to `/sign-in` page on unsuccessful sign-in (user denied access to the application)
      return NextResponse.redirect('http://localhost:3000/sign-in');
  }

  const response = await AuthGET(request);
  return response;
}