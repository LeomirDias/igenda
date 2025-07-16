import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";

import LoginForm from "./_components/login-form ";
import SignUpForm from "./_components/sign-up-form";
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
      {/* Container centralizado */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Image
            src="/LogoiGenda.png"
            alt="iGenda Logo"
            width={300}
            height={80}
            className="h-24 w-auto"
            priority
          />
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 border border-[#000000] bg-[#000000]/5">
            <TabsTrigger value="login" className="cursor-pointer">
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="cursor-pointer">
              Criar conta
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm />
          </TabsContent>

          <TabsContent value="register">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer fixo na parte inferior */}
      <footer className="text-muted-foreground absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-sm">
        Ao acessar, você concorda com os{" "}
        <Link href="/terms" className="text-primary" target="_blank">
          Termos de uso
        </Link>{" "}
        e a{" "}
        <Link href="/privacy" className="text-primary" target="_blank">
          Política de privacidade
        </Link>
      </footer>
    </div>
  );
};

export default AuthenticationPage;
