'use client';

import { useFormState } from "react-dom";
import { authenticate } from "@/app/lib/actions";

export default function LoginPage() {

  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  return (
    <main>
      <form action={dispatch}>
        <button type="submit">Submit</button>
      </form>
    </main>
  )
}