/**
 * @file Sign-in and sign-out buttons
 * @version 0.0.1
 */

import { signOut, signIn } from "@/auth";
import Link from "next/link";

export function SignIn(
  props: Omit<React.ComponentPropsWithRef<typeof Link>, "href">
) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn('patreon', { redirectTo: process.env.REDIRECT_URL_ON_SIGNIN });
      }}
    >
      <button>Sign In</button>
    </form>
  );
}

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: process.env.REDIRECT_URL_ON_SIGNOUT });
      }}
    >
      <button>Sign Out</button>
    </form>
  );
}