import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { PageActions, PageContainer, PageContent, PageDescription, PageHeader, PageHeaderContent, PageTitle } from "@/components/ui/page-container"
import { db } from "@/db";
import { servicesTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import AddServiceButton from "./_components/add-service-button";
import ServiceCard from "./_components/service-card";

const EnterpriseServicesPage = async () => {


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

    const services = await db.query.servicesTable.findMany({
        where: eq(servicesTable.enterpriseId, session.user.enterprise.id),
    })

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
                <div className="grid grid-cols-6 gap-6">
                    {services.map(service => <ServiceCard key={service.id} service={service} />)}
                </div>
            </PageContent>
        </PageContainer>
    );
}

export default EnterpriseServicesPage;