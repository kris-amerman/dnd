import { signOut } from "@/app/lib/actions";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <form
        action={signOut}
      >
        <button>Sign Out</button>
      </form>
      <div>{children}</div>
    </div>
  );
}