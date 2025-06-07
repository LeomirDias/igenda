import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";


import ClientSignUpForm from "./_components/client-sign-up-form";
import ClientLoginForm from "./_components/client-login-form";


const AuthenticationPage = async () => {

    // const session = await auth.api.getSession({
    //     headers: await headers(),
    // });

    // if (session?.user) {
    //     redirect("/dashboard");
    // }

    return (
        <div className="flex h-screen w-screen items-center justify-center p-4">
            <Tabs defaultValue="login" className="w-full max-w-[400px] mx-auto">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Criar conta</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <ClientLoginForm />
                </TabsContent>
                <TabsContent value="register">
                    <ClientSignUpForm />
                </TabsContent>
            </Tabs>
        </div>
    )
};

export default AuthenticationPage;