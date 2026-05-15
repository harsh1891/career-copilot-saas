import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-5">
      <SignUp />
    </main>
  );
}
