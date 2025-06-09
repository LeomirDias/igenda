import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { SlugPageContainer, SlugPageContent, SlugPageDescription, SlugPageHeaderContent, SlugPageTitle } from "@/components/ui/slug-page-container";
import { SlugPageHeader } from "@/components/ui/slug-page-container";
import { db } from "@/db";
import { enterprisesTable, servicesTable } from "@/db/schema";

import ServiceCard from "./_components/service-card";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

const PublicEnterpriseServicesPage = async ({ params }: PageProps) => {
    const { slug } = await params;

    if (!slug) {
        redirect("/enterprise-not-found");
    }

    const enterprise = await db.query.enterprisesTable.findFirst({
        where: eq(enterprisesTable.slug, slug),
    });

    if (!enterprise) {
        redirect("/enterprise-not-found");
    }

    const services = await db.query.servicesTable.findMany({
        where: eq(servicesTable.enterpriseId, enterprise.id),
    });

    return (
        <SlugPageContainer>
            <SlugPageHeader>
                <SlugPageHeaderContent>
                    <SlugPageTitle>Catalogo de serviços {enterprise.name}</SlugPageTitle>
                    <SlugPageDescription>Selecione um serviço para agendar</SlugPageDescription>
                </SlugPageHeaderContent>
            </SlugPageHeader>
            <SlugPageContent>
                <div className="flex flex-col gap-4">
                    {services.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </div>
            </SlugPageContent>
        </SlugPageContainer>
    );
}

export default PublicEnterpriseServicesPage;