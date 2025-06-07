import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const ClientHomePage = async () => {

    // const session = await auth.api.getSession({
    //     headers: await headers(),
    // });

    // if (!session?.client) {
    //     redirect("/authentication");
    // }

    // if (!session?.user.enterprise) {
    //     redirect("/enterprise-form");
    // }
    // else {
    //     redirect("/dashboard");
    // }

    return (
        <h1>Página Inicial - RECEBERÁ AS INFORMAÇÕES DA EMPRESA E OS BOTÕES PARA AGENDAR OU CONFERIR AGENDAMENTOS</h1>
    );
}

export default ClientHomePage;