import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { PageActions, PageContainer, PageContent, PageDescription, PageHeader, PageHeaderContent, PageTitle } from "@/components/ui/page-container"
import { db } from "@/db";
import { clientsTable, servicesTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import AddClientButton from "./_components/add-client-button";

const ClientsPage = async () => {

    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session?.user) {
        redirect("/authentication");
    }
    if (!session?.user.enterprise) {
        redirect("/enterprise-form");
    }

    const clients = await db.query.clientsTable.findMany({
        where: eq(clientsTable.enterpriseId, session.user.enterprise.id),
    })

    return (
        <PageContainer>
            <PageHeader>
                <PageHeaderContent>
                    <PageTitle>Serviços</PageTitle>
                    <PageDescription>Visualize e gerencie os clientes cadastrados na sua empresa.</PageDescription>
                </PageHeaderContent>
                <PageActions>
                    <AddClientButton />
                </PageActions>
            </PageHeader>
            <PageContent>
                <div className="grid grid-cols-6 gap-6">
                    {/*{clients.map(service => <ServiceCard key={service.id} service={service} />)}*/}
                </div>
            </PageContent>
        </PageContainer>
    );
}

export default ClientsPage;