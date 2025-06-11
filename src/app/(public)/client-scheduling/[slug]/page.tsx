import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { SlugPageContainer, SlugPageContent, SlugPageHeader, SlugPageHeaderContent, SlugPageTitle } from "@/components/ui/slug-page-container";
import { SlugPageDescription } from "@/components/ui/slug-page-container";
import { db } from "@/db";
import { enterprisesTable, servicesTable } from "@/db/schema";
import { getClientFromToken } from "@/middleware/client-auth";

import SlugPagesFooter from "../../_components/slug-pages-footer";
import ServiceCard from "./_components/service-card";


interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

const ClientSchedulingPage = async ({ params }: PageProps) => {
    const { slug } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("client_token")?.value;

    const client = await getClientFromToken(token ?? "");

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
                    <SlugPageTitle>Olá, {client?.name ? client.name : "Sejam Bem-Vindo(a)"}!</SlugPageTitle>
                    <SlugPageDescription>Faça seu agendamento com a {enterprise.name}</SlugPageDescription>
                </SlugPageHeaderContent>
            </SlugPageHeader>
            <Separator />
            <SlugPageContent>
                <ServiceCard services={services} />
            </SlugPageContent>
            <SlugPagesFooter />
        </SlugPageContainer>

    );
}

export default ClientSchedulingPage;