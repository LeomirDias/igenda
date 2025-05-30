import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { PageActions, PageContainer, PageContent, PageDescription, PageHeader, PageHeaderContent, PageTitle } from "@/components/ui/page-container"
import { auth } from "@/lib/auth";

import AddProfessionalButton from "./_components/add-professional-button";

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
                <p>Em breve, você poderá gerenciar os profissionais da sua empresa.</p>
            </PageContent>
        </PageContainer>
    );
}

export default ProfessionalsPage;