import { auth } from "@/auth";
import { SignIn, SignOut } from "./sign-in-out";

export async function AuthButton() {
  const session = await auth();
  return session ? (
    <SignOut />
  ) : (
    <div>
      <SignIn />
    </div>
  );
}