import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/favicon.ico')) {
    return
  }

  console.log(`Request URL: ${request.nextUrl}\n.....`)
  const isLoggedIn = request.cookies.has('user') && !!request.cookies.get('user')?.value
  const isOnContent = request.nextUrl.pathname.startsWith('/content')
  const isOnLogin = request.nextUrl.pathname.startsWith('/login')
  const searchParams: URLSearchParams = request.nextUrl.searchParams;
  const hasCode = searchParams.has('code');


  console.log(`Is accessing restriced content: ${isOnContent}\n.....`)
  console.log(`Is logged in: ${isLoggedIn}\n.....`)

  if (isOnContent && !isLoggedIn) {
    console.log('Fetching details from Patreon\n.....')
    const code = searchParams.get('code');
    const clientId = process.env.PATREON_CLIENT_ID;
    const clientSecret = process.env.PATREON_CLIENT_SECRET;

    if (!hasCode) {
      console.log('Request does not include one-time code; redirecting to login\n.....')
      return NextResponse.redirect(new URL('/login', 'http://localhost:3000'))
    }

    if (!clientId || !clientSecret) {
      console.log('Must specify Patreon id and secret!')
      return NextResponse.redirect(new URL('/login', 'http://localhost:3000'))
    }

    const token_res = await fetch(`https://www.patreon.com/api/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `code=${code}&grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=http://localhost:3000/content/atlas`
    })

    const token_data = await token_res.json();
    const token = token_data.access_token;

    if (!token) {
      return NextResponse.redirect(new URL('/login', 'http://localhost:3000'))
    }

    const user_res = await fetch(`https://www.patreon.com/api/oauth2/api/current_user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    const user_data = await user_res.json();
    if (user_data) {
      console.log("USER FOUND\n------------------------------")
      const response = NextResponse.next()
      response.cookies.set('user', user_data, {
        maxAge: 900,
      }) 
      
      return response
    }
    else {
      console.log("USER NOT FOUND\n------------------------------")
      return NextResponse.redirect(new URL('/login', 'http://localhost:3000'))
    }
  } else if (isLoggedIn && isOnLogin) {
    console.log('------------------------------')
    return NextResponse.redirect(new URL('/content/atlas', 'http://localhost:3000'))
  }
  console.log('------------------------------')
}

export default NextAuth(authConfig).auth;


export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};