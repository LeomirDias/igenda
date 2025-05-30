import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { PageActions, PageContainer, PageContent, PageDescription, PageHeader, PageHeaderContent, PageTitle } from "@/components/ui/page-container"
import { auth } from "@/lib/auth";

import AddServiceButton from "./_components/add-service-button";

const EnterpriseServicesPage = async () => {

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
                    <PageTitle>Serviços</PageTitle>
                    <PageDescription>Gerencie o catalogo de serviços da sua empresa.</PageDescription>
                </PageHeaderContent>
                <PageActions>
                    <AddServiceButton />
                </PageActions>
            </PageHeader>
            <PageContent>
                <p>Em breve, você poderá gerenciar os serviços da sua empresa.</p>
            </PageContent>
        </PageContainer>
    );
}

export default EnterpriseServicesPage;