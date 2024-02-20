/**
 * @file NextAuth configuration
 * @version 0.0.1
 */

import NextAuth from "next-auth";
import type { NextAuthConfig, User, Session, Profile } from "next-auth";
import PatreonProvider from "next-auth/providers/patreon"

// CONSTANTS
const REDIRECT_URI = "http://localhost:3000/api/auth/callback/patreon"; // must be registered with Patreon
const CAMPAIGN_ID = ""

// INTERFACES
interface ProfileData {
  relationships?: {
    pledges: {
      data?: any; 
    };
  };
}

declare module "next-auth" {
  interface Session {
    user: {
      picture?: string;
    } & Omit<User, "id">;
  }
}

export const authConfig = {
  debug: true,
  providers: [
    PatreonProvider({
      clientId: process.env.PATREON_CLIENT_ID,
      clientSecret: process.env.PATREON_CLIENT_SECRET,
      authorization: {
        params: {
          redirect_uri: REDIRECT_URI,
        },
      },
    })
  ],
  callbacks: {
    signIn({profile}) {
      if (profile?.data) {
        const pledges = (profile.data as ProfileData).relationships?.pledges.data
        return pledges.some((pledge: any) => pledge.id === CAMPAIGN_ID) // TODO: not sure what the structure of data is

      }
      return false // something went wrong
    },
    authorized(params) {
      console.log(`is authorized???? ${!!params.auth?.user}`)
      return !!params.auth?.user;
    },

  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);