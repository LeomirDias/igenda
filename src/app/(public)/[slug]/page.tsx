import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { SlugPageContainer, SlugPageContent } from "@/components/ui/slug-page-container";
import { db } from "@/db";
import { enterprisesTable, servicesTable } from "@/db/schema";

import PublicPagesHeader from "../_components/public-pages-header";
import ServiceCard from "./_components/service-card";

interface PageProps {
    params: {
        slug: string;
    };
}

const ClientSchedulingPage = async ({ params }: PageProps) => {
    const { slug } = params;

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
            <PublicPagesHeader params={{ slug }} />
            <Separator />
            <SlugPageContent>
                <div>
                    <ServiceCard services={services} />
                </div>
            </SlugPageContent>
        </SlugPageContainer>
    );
}

export default ClientSchedulingPage;