
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { getClientFromToken } from "@/middleware/client-auth";

import LastAppointmentsCard from "./components/last-appointments-card";



interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

const ClientHomePage = async ({ params }: PageProps) => {
    const { slug } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("client_token")?.value;

    if (!token) {
        redirect(`/client-authentication/${slug}`);
    }

    const client = await getClientFromToken(token);

    if (!client) {
        redirect(`/client-authentication/${slug}`);
    }

    return (
        <div className="p-5">
            <h1 className="text-xl font-bold">Olá {client?.name}!</h1>
            <p className="text-sm text-muted-foreground">Sexta-Feira, 13 de Junho</p>

            <Separator className="my-4" />

            <div className="flex flex-col gap-4">
                <LastAppointmentsCard />
            </div>
        </div>
    );
}

export default ClientHomePage;