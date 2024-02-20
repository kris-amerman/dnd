/**
 * @file NextAuth configuration
 * @version 0.0.1
 */

import NextAuth from "next-auth";
import type { NextAuthConfig, User } from "next-auth";
import PatreonProvider from "next-auth/providers/patreon"

// INTERFACES (update when we have structure of data)
interface ProfileData {
  relationships?: {
    pledges: {
      data: any; 
    },
    campaign: {
      data: {
        id: string;
        type: string;
      },
      links: {
        related: string;
      }
    }
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
  // debug: true,
  providers: [
    PatreonProvider({
      clientId: process.env.PATREON_CLIENT_ID,
      clientSecret: process.env.PATREON_CLIENT_SECRET,
      authorization: {
        params: {
          redirect_uri: process.env.REDIRECT_URI_PROVIDER,
        },
      },
    })
  ],
  callbacks: {
    signIn({profile}) {
      if (profile?.data) {
        const pledge_data = (profile.data as ProfileData).relationships?.pledges.data
        return true // for now
        // return pledge_data.some((pledge: any) => pledge.id === process.env.CAMPAIGN_ID) // TODO: not sure what the structure of data is yet
      }
      return false // if here something went wrong
    },
    authorized(params) {
      return !!params.auth?.user;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);