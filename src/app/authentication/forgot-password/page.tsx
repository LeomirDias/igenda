import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import ForgotPasswordForm from "../components/forgot-password-form";

const AuthenticationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen w-screen">
      <div className="h-full w-1/2">
        <img
          src="/CapaAuthentication.png"
          alt="logo"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex w-1/2 flex-col">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-[400px]">
            <ForgotPasswordForm />
          </div>
        </div>
        <footer className="text-muted-foreground mx-auto mb-8 w-[400px] py-4 text-center text-sm">
          © {new Date().getFullYear()} iGenda. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
};

export default AuthenticationPage;
