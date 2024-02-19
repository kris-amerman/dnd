import { auth } from "@/auth";
import { SignIn, SignOut } from "./sign-in-out";

export async function AuthButton() {
  const session = await auth();
  console.log(session ? 'session' : 'no session');
  return session ? (
    <SignOut />
  ) : (
    <div>
      <SignIn />
    </div>
  );
}