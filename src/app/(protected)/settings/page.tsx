import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { PageContainer, PageContent, PageDescription, PageHeader, PageHeaderContent, PageTitle } from "@/components/ui/page-container"
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { enterprisesTable } from "@/db/schema";
import UserCard from "./_components/user-card";
import EnterpriseCard from "./_components/enterprise-card";

const SettingsPage = async () => {

    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user) {
        redirect("/authentication");
    }
    if (!session.user.enterprise) {
        redirect("/enterprise-form");
    }
    if (!session.user.plan) {
        redirect("/subscription-plans");
    }

    const enterprise = await db.query.enterprisesTable.findFirst({
        where: eq(enterprisesTable.id, session.user.enterprise.id),
    });

    if (!enterprise) {
        throw new Error("Empresa não encontrada");
    }

    return (
        <PageContainer>
            <PageHeader>
                <PageHeaderContent>
                    <PageTitle>Ajustes</PageTitle>
                    <PageDescription>Visualize e gerencie os ajustes da sua conta e da sua empresa.</PageDescription>
                </PageHeaderContent>
            </PageHeader>
            <PageContent>
                <div className="flex flex-col gap-4">
                    <UserCard user={session.user} />
                    <EnterpriseCard enterprise={enterprise} />
                </div>
            </PageContent>
        </PageContainer>
    );
}

export default SettingsPage;