import { handlers } from "@/auth";
import { NextRequest, NextResponse} from "next/server";

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

  if (
    urlSearchParams.get('error') === 'AuthorizedCallbackError' // Access Denied
  ) {
    // Redirect the user to `/sign-in` page on unsuccessful sign-in (signIn returned false)
    return NextResponse.redirect('http://localhost:3000/sign-in');
  }

  const response = await AuthGET(request);
  return response;
}