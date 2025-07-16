import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import EmailVerification from "./components/email-verification";
import Image from "next/image";
import Link from "next/link";

const AuthenticationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        <EmailVerification />
      </div>
    </div>
  );
};

export default AuthenticationPage;
