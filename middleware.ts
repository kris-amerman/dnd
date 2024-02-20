import { auth } from "@/auth";

// Authentication is done by the callbacks.authorized callback
export const middleware = auth;

export const config = {
    matcher: ['/content/:path*'],
};