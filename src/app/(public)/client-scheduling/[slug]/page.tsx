import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { enterprisesTable } from "@/db/schema";
import { getClientFromToken } from "@/middleware/client-auth";


interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

const ClientSchedulingPage = async ({ params }: PageProps) => {
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

    const enterprise = await db.query.enterprisesTable.findFirst({
        where: eq(enterprisesTable.slug, slug),
    });

    if (!enterprise) {
        redirect("/enterprise-not-found");
    }


    return (
        <div>
            <h1>Client Scheduling Page</h1>
        </div>
    );
}

export default ClientSchedulingPage;