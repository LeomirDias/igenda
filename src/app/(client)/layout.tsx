import { cookies } from "next/headers";
import { getClientFromToken } from "@/middleware/client-auth";
import { ClientAuthProvider } from "@/contexts/client-auth-context";

interface ClientLayoutProps {
    children: React.ReactNode;
    params: Promise<{
        slug: string;
    }>;
}

export default async function ClientLayout({ children }: ClientLayoutProps) {
    const cookieStore = await cookies();
    const token = cookieStore.get("client_token")?.value;
    const client = token ? await getClientFromToken(token) : null;

    return (
        <ClientAuthProvider initialClient={client}>
            {children}
        </ClientAuthProvider>
    );
} 