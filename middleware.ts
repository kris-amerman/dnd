import { auth } from "@/auth";

console.log(`calling MIDDLEWARE`)

export const middleware = auth;

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};