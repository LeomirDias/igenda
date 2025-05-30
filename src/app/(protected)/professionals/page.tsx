import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { PageActions, PageContainer, PageContent, PageDescription, PageHeader, PageHeaderContent, PageTitle } from "@/components/ui/page-container"
import { db } from "@/db";
import { professionalsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import AddProfessionalButton from "./_components/add-professional-button";
import ProfessionalCard from "./_components/profesisonal-card";

const ProfessionalsPage = async () => {

    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user) {
        redirect("/authentication");
    }
    if (!session?.user.enterprise) {
        redirect("/enterprise-form");
    }

    const professionals = await db.query.professionalsTable.findMany({
        where: eq(professionalsTable.enterpriseId, session.user.enterprise.id),
    })

    return (
        <PageContainer>
            <PageHeader>
                <PageHeaderContent>
                    <PageTitle>Profissionais</PageTitle>
                    <PageDescription>Gerencie os profissionais da sua empresa.</PageDescription>
                </PageHeaderContent>
                <PageActions>
                    <AddProfessionalButton />
                </PageActions>
            </PageHeader>
            <PageContent>
                <div className="grid grid-cols-5 gap-6">
                    {professionals.map(professional => <ProfessionalCard key={professional.id} professional={professional} />)}
                </div>
            </PageContent>
        </PageContainer>
    );
}

export default ProfessionalsPage;