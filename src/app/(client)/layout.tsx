import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getClientFromToken } from "@/middleware/client-auth";
import { ClientAuthProvider } from "@/contexts/client-auth-context";
import { db } from "@/db";
import { enterprisesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

interface ClientLayoutProps {
    children: React.ReactNode;
    params: Promise<{
        slug: string;
    }>;
}

export default async function ClientLayout({ children, params }: ClientLayoutProps) {
    const { slug } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("client_token")?.value;

    if (!token) {
        redirect(`/${slug}/client-authentication`);
    }

    const client = await getClientFromToken(token);

    if (!client) {
        redirect(`/${slug}/client-authentication`);
    }

    return (
        <ClientAuthProvider initialClient={client}>
            {children}
        </ClientAuthProvider>
    );
} 