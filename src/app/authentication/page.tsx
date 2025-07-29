"use client";

import { useState } from "react";
import Image from "next/image";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import LoginForm from "./_components/login-form ";
import SignUpForm from "./_components/sign-up-form";
import OpenTermsButton from "./_components/open-terms-button";
import OpenPrivacyPoliciesButton from "./_components/open-privacy-policies-button";

const AuthenticationPage = () => {
  const [tab, setTab] = useState("login");
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
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

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 border border-[#202020] bg-[#202020]/5">
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

      <div className="text-muted-foreground mt-2 text-center text-xs">
        {tab === "register"
          ? "Ao se cadastrar, você concorda com os"
          : "Ao utilizar, você concorda com os"}{" "}
        <span className="inline">
          <OpenTermsButton className="m-0 inline p-0 align-baseline text-xs" />
        </span>{" "}
        e a{" "}
        <span className="inline">
          <OpenPrivacyPoliciesButton className="m-0 inline p-0 align-baseline text-xs" />
        </span>
      </div>

      <footer className="text-muted-foreground absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-xs">
        <span className="inline">
          © {year} Synqia. Todos os direitos reservados. iGenda é uma marca
          registrada da Synqia.
        </span>
      </footer>
    </div>
  );
};

export default AuthenticationPage;
