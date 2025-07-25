import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import ForgotPasswordForm from "../_components/forgot-password-form";
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
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="flex w-full max-w-md flex-col items-center sm:max-w-lg md:max-w-xl">
        <div className="mb-6 flex justify-center sm:mb-8">
          <Image
            src="/LogoiGenda.png"
            alt="iGenda Logo"
            width={300}
            height={80}
            className="h-20 w-auto sm:h-24"
            priority
          />
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default AuthenticationPage;
