import { handlers } from "@/auth";
import { NextRequest, NextResponse} from "next/server";

const { GET: AuthGET, POST } = handlers;
export { POST };

// Showcasing advanced initialization in Route Handlers
export async function GET(request: NextRequest) {
  
  // Check if 'error' parameter with value 'AuthorizedCallbackError' exists
  const urlSearchParams = new URLSearchParams(request.nextUrl.searchParams);
  if (
    urlSearchParams.get('error') === 'AuthorizedCallbackError'
  ) {
    // Redirect the user to `api/auth/signin`
    return NextResponse.redirect('http://localhost:3000/api/auth/signin'); // TODO: parameterize base url
  }

  // Do something with request
  const response = await AuthGET(request);
  // Do something with response
  return response;
}