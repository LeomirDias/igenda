import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";

import LoginForm from "./components/login-form ";
import SignUpForm from "./components/sign-up-form";


const AuthenticationPage = async () => {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user) {
        redirect("/dashboard");
    }

    return (
        <div className="flex h-screen w-screen">
            <div className="w-1/2 h-full">
                <img src="/CapaAuthentication.png" alt="logo" className="h-full w-full object-cover" />
            </div>

            <div className="w-1/2 flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-[400px]">
                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="register">Criar conta</TabsTrigger>
                            </TabsList>

                            <TabsContent value="login">
                                <LoginForm />
                            </TabsContent>

                            <TabsContent value="register">
                                <SignUpForm />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                <footer className="w-[400px] py-4 text-center text-sm text-muted-foreground mx-auto mb-8">
                    © {new Date().getFullYear()} iGenda. Todos os direitos reservados.
                </footer>
            </div>
        </div>
    )
};



export default AuthenticationPage;