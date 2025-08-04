"use client";

import Image from "next/image";
import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import LoginForm from "./_components/login-form ";
import OpenPrivacyPoliciesButton from "./_components/open-privacy-policies-button";
import OpenTermsButton from "./_components/open-terms-button";
import SignUpForm from "./_components/sign-up-form";

const AuthenticationPage = () => {
  const [tab, setTab] = useState("login");

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        <div className="flex justify-center">
          <Image
            src="/LogoCompletaiGenda.png"
            alt="iGenda Logo"
            width={400}
            height={80}
            className="h-42 w-auto"
            priority
          />
        </div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 border bg-gradient-to-br from-[#347d61] to-[#88b94d]">
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

      <div className="mt-2 text-center text-xs">
        <span className="inline text-white">
          <OpenTermsButton className="m-0 inline p-0 align-baseline text-xs" />{" "}e{" "}
          <OpenPrivacyPoliciesButton className="m-0 inline p-0 align-baseline text-xs" />
        </span>
      </div>
    </div>
  );
};

export default AuthenticationPage;
