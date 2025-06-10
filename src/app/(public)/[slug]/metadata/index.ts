import { eq } from "drizzle-orm";
import { Metadata } from "next";

import { db } from "@/db";
import { enterprisesTable } from "@/db/schema";

export const generateEnterpriseMetadata = async ({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> => {
    const { slug } = await params;

    const enterprise = await db.query.enterprisesTable.findFirst({
        where: eq(enterprisesTable.slug, slug),
    });

    return {
        title: enterprise ? `iGenda | ${enterprise.name}` : "iGenda",
        description: enterprise?.specialty || "Faça seu agendamento online",
        openGraph: {
            title: enterprise ? `iGenda | ${enterprise.name}` : "iGenda",
            description: enterprise?.specialty || "Faça seu agendamento online",
            images: enterprise?.avatarImageURL ? [enterprise.avatarImageURL] : [],
        },
    };
} 